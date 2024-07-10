import { captureException, setExtra } from "@sentry/nextjs";

export const config = {
  runtime: "edge",
};

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

async function fetchWithRedirects(url, options = {}, maxRedirects = 5) {
  let currentUrl = url;
  let redirectCount = 0;
  let cookieJar = {};

  while (redirectCount < maxRedirects) {
    console.log(`Attempting fetch for URL: ${currentUrl}`);

    const cookieString = Object.entries(cookieJar)
      .map(([key, value]) => `${key}=${value}`)
      .join("; ");

    const response = await fetch(currentUrl, {
      ...options,
      headers: {
        ...options.headers,
        Cookie: cookieString,
      },
      redirect: "manual",
    });

    console.log(`Response status: ${response.status}`);
    console.log(
      "Response headers:",
      JSON.stringify(Object.fromEntries(response.headers))
    );

    // Handle cookies
    const setCookieHeader = response.headers.get("Set-Cookie");
    if (setCookieHeader) {
      setCookieHeader.split(",").forEach((cookie) => {
        const [cookieName, ...rest] = cookie.split(";")[0].split("=");
        const cookieValue = rest.join("=");
        if (cookieName && cookieValue) {
          cookieJar[cookieName.trim()] = cookieValue.trim();
        }
      });
    }

    if (response.status === 200) {
      return response;
    } else if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("Location");
      if (!location) {
        throw new Error("Redirect location header missing");
      }
      currentUrl = new URL(location, currentUrl).toString();
      redirectCount++;
      console.log(`Redirect ${redirectCount} to ${currentUrl}`);
    } else {
      throw new HTTPError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }
  }

  throw new Error(`Too many redirects: ${url}`);
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

    const response = await fetchWithRedirects(itemUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    const html = await response.text();

    console.log("Successfully fetched content. Length:", html.length);
    console.log("First 200 characters:", html.substring(0, 200));

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
    case error.message.includes("Too many redirects"):
      status = 508; // Loop Detected
      message = "Too many redirects detected";
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
