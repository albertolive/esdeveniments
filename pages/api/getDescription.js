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

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
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
  const itemUrl = searchParams.get("itemUrl");

  try {
    if (!itemUrl) {
      throw new ValidationError("Item URL is required");
    }

    const response = await fetchWithTimeout(itemUrl, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!response.ok) {
      throw new HTTPError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const decoder = getDecoder(response);
    const html = decoder.decode(arrayBuffer);

    return new Response(html, {
      status: 200,
      headers: HEADERS_HTML,
    });
  } catch (error) {
    return handleError(error, itemUrl);
  }
}

function handleError(error, itemUrl) {
  setExtra("itemUrl", itemUrl);
  captureException(error);

  let status, message;

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

  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: HEADERS_JSON,
  });
}
