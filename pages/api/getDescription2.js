import { captureException, setExtra } from "@sentry/nextjs";
import fetch from "node-fetch";

export const config = {
  runtime: "edge",
};

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

const HEADERS_JSON = { "Content-Type": "application/json" };
const HEADERS_HTML = { "Content-Type": "text/html" };

class HTTPError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "HTTPError";
    this.status = status;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

async function fetchWithTimeout(url, options = {}, timeout = 30000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
    headers: {
      ...options.headers,
      "User-Agent": USER_AGENT,
    },
  });

  clearTimeout(id);

  return response;
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  let itemUrl = searchParams.get("itemUrl");

  console.log("Received request for itemUrl:", itemUrl);

  try {
    itemUrl = decodeURIComponent(itemUrl);

    if (!itemUrl) {
      throw new ValidationError("Item URL is required");
    }

    try {
      new URL(itemUrl);
    } catch (urlError) {
      throw new ValidationError("Invalid URL format");
    }

    console.log("Attempting to fetch URL:", itemUrl);
    const fetchStart = Date.now();
    const response = await fetchWithTimeout(itemUrl);
    const fetchEnd = Date.now();
    console.log(`Fetch completed in ${fetchEnd - fetchStart}ms`);

    if (!response.ok) {
      throw new HTTPError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const html = await response.text();

    console.log("Content length:", html.length);
    console.log("First 200 characters of content:", html.substring(0, 200));

    console.log("Successfully fetched and decoded content");
    return new Response(html, {
      status: 200,
      headers: HEADERS_HTML,
    });
  } catch (error) {
    console.error("Error in handler:", error);
    return handleError(error, itemUrl);
  }
}

function handleError(error, itemUrl) {
  setExtra("itemUrl", itemUrl);
  captureException(error);

  let status, message;

  console.error("Error details:", {
    name: error.name,
    message: error.message,
    stack: error.stack,
    itemUrl: itemUrl,
  });

  switch (true) {
    case error instanceof ValidationError:
      status = 400;
      message = error.message;
      break;
    case error instanceof HTTPError:
      status = error.status >= 500 ? 502 : 400;
      message =
        error.status >= 500
          ? "Server error fetching the item"
          : "Invalid item URL";
      break;
    case error.name === "AbortError":
      status = 504;
      message = "Request timed out";
      break;
    default:
      status = 500;
      message = "An unexpected error occurred";
  }

  console.error("Error response:", { status, message });

  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: HEADERS_JSON,
  });
}
