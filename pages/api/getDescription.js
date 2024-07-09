import { captureException, setExtra } from "@sentry/nextjs";

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

async function fetchWithTimeout(url, options, timeout = 25000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const MAX_REDIRECTS = 5; // Limit the number of redirects
  let redirectCount = 0;
  let finalResponse;

  try {
    let response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...options.headers,
        "User-Agent": USER_AGENT, // Ensure User-Agent is set
      },
      redirect: "manual", // Handle redirects manually
    });

    while (
      response.status >= 300 &&
      response.status < 400 &&
      redirectCount < MAX_REDIRECTS
    ) {
      const location = response.headers.get("Location");
      if (!location) break;
      redirectCount++;
      console.log(`Redirect ${redirectCount} to ${location}`);
      response = await fetch(location, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
          "User-Agent": USER_AGENT, // Ensure User-Agent is set
        },
        redirect: "manual",
      });
    }

    clearTimeout(id);
    finalResponse = response;

    if (redirectCount >= MAX_REDIRECTS) {
      throw new Error(`Too many redirects: ${url}`);
    }

    return finalResponse;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

function getDecoder(response) {
  const contentType = response.headers.get("content-type");
  const defaultEncoding = "utf-8";
  const fallbackEncoding = "iso-8859-1";

  if (contentType) {
    const charset = contentType.match(/charset=([^;]+)/i);
    if (charset && charset[1]) {
      return new TextDecoder(charset[1]);
    }
  }

  return {
    decode: function (arrayBuffer) {
      try {
        const decodedText = new TextDecoder(defaultEncoding).decode(
          arrayBuffer
        );
        if (decodedText.includes("�")) {
          throw new Error("Invalid character detected, fallback needed");
        }
        return decodedText;
      } catch (e) {
        return new TextDecoder(fallbackEncoding).decode(arrayBuffer);
      }
    },
  };
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

    const response = await fetchWithTimeout(itemUrl, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error(
        `Fetch error! status: ${response.status}, response: ${responseText}`
      );
      throw new HTTPError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const decoder = getDecoder(response);
    const html = decoder.decode(arrayBuffer);

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

  // Log detailed error information
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
    case error.message.includes("Too many redirects"):
      status = 500;
      message = "Too many redirects detected";
      break;
    default:
      status = 500;
      message = "An unexpected error occurred";
  }

  // Log the final error response
  console.error("Error response:", { status, message });

  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: HEADERS_JSON,
  });
}
