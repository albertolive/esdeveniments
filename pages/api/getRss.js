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

    const data = await response.text();
    const json = parser.parse(data);

    if (!json || !json.rss || !json.rss.channel) {
      throw new ParseError("Invalid RSS data format");
    }

    const items = json.rss.channel.item
      ? Array.isArray(json.rss.channel.item)
        ? json.rss.channel.item
        : [json.rss.channel.item]
      : [];

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
      message = error.message;
      break;
    case error instanceof HTTPError:
      status = error.status >= 500 ? 502 : 400;
      message =
        error.status >= 500 ? "RSS feed server error" : "Invalid RSS feed URL";
      break;
    case error instanceof ParseError:
      status = 422;
      message = "Failed to parse RSS feed";
      break;
    case error.name === "AbortError":
      status = 504;
      message = "Request timed out";
      break;
    default:
      status = 500;
      message = "An unexpected error occurred";
  }

  return new Response(JSON.stringify({ error: message, items: [] }), {
    status,
    headers: HEADERS_JSON,
  });
}
