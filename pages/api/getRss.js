import { XMLParser } from "fast-xml-parser";
import { captureException, setExtra } from "@sentry/nextjs";

export const config = {
  runtime: "edge",
};

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
const HEADERS_JSON = { "Content-Type": "application/json" };

const parser = new XMLParser();

class HTTPError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "HTTPError";
    this.status = status;
  }
}

class ParseError extends Error {
  constructor(message) {
    super(message);
    this.name = "ParseError";
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

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const rssFeed = searchParams.get("rssFeed");

  try {
    if (!rssFeed) {
      throw new ValidationError("RSS feed URL is required");
    }

    const response = await fetchWithTimeout(rssFeed, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!response.ok) {
      throw new HTTPError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const textData = await response.text();
      data = parser.parse(textData);
    }

    let items = [];

    if (Array.isArray(data)) {
      items = data;
    } else if (data && data.rss && data.rss.channel) {
      items = data.rss.channel.item
        ? Array.isArray(data.rss.channel.item)
          ? data.rss.channel.item
          : [data.rss.channel.item]
        : [];
    } else {
      throw new ParseError("Invalid data format");
    }

    if (items.length === 0) {
      return new Response(
        JSON.stringify({ message: "No items found in the feed", items: [] }),
        {
          status: 200,
          headers: HEADERS_JSON,
        }
      );
    }

    return new Response(JSON.stringify({ items }), {
      status: 200,
      headers: HEADERS_JSON,
    });
  } catch (error) {
    return handleError(error, rssFeed);
  }
}

function handleError(error, rssFeed) {
  setExtra("rssFeed", rssFeed);
  captureException(error);

  let status, message;

  switch (true) {
    case error instanceof ValidationError:
      status = 400;
      message = `Invalid input: ${error.message}. Please provide a valid RSS feed URL.`;
      break;
    case error instanceof HTTPError:
      if (error.status >= 500) {
        status = 502;
        message = `RSS feed server error (HTTP ${error.status}): The server is not responding correctly. Please try again later.`;
      } else {
        status = 400;
        message = `RSS feed access error (HTTP ${error.status}): The feed URL is invalid or inaccessible. Please check the URL and your internet connection.`;
      }
      break;
    case error instanceof ParseError:
      status = 422;
      message = `RSS feed parsing error: ${error.message}. The feed may be malformed or in an unsupported format.`;
      break;
    case error.name === "AbortError":
      status = 504;
      message =
        "Request timeout: The RSS feed took too long to respond. The feed might be slow or temporarily unavailable.";
      break;
    default:
      status = 500;
      message = `Unexpected error: ${error.message}. Please try again or contact support if the issue persists.`;
  }

  console.error(`Error handling RSS feed (${rssFeed}):`, {
    status,
    message,
    errorName: error.name,
    errorMessage: error.message,
    stack: error.stack,
  });

  return new Response(JSON.stringify({ error: message, items: [] }), {
    status,
    headers: HEADERS_JSON,
  });
}
