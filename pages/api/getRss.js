import { XMLParser } from "fast-xml-parser";
import { captureException, setExtra } from "@sentry/nextjs";

export const config = {
  runtime: "edge",
};

const parser = new XMLParser();

// Custom error classes
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

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const rssFeed = searchParams.get("rssFeed");

  try {
    if (!rssFeed) {
      throw new ValidationError("RSS feed URL is required");
    }

    const response = await fetch(rssFeed, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new HTTPError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const data = await response.text();
    const json = parser.parse(data);

    if (!json || !json.rss || !json.rss.channel || !json.rss.channel.item) {
      throw new ParseError("Invalid RSS data format or no items in feed");
    }

    const items = Array.isArray(json.rss.channel.item)
      ? json.rss.channel.item
      : [json.rss.channel.item];

    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleError(error, rssFeed);
  }
}

function handleError(error, rssFeed) {
  setExtra("rssFeed", rssFeed);
  captureException(error);

  let status, message;

  switch (error.constructor) {
    case ValidationError:
      status = 400;
      message = error.message;
      break;
    case HTTPError:
      status = error.status >= 500 ? 502 : 400;
      message =
        error.status >= 500 ? "RSS feed server error" : "Invalid RSS feed URL";
      break;
    case ParseError:
      status = 422;
      message = "Failed to parse RSS feed";
      break;
    default:
      status = 500;
      message = "An unexpected error occurred";
  }

  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
