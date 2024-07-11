import { captureException, setExtra } from "@sentry/nextjs";
import { siteUrl } from "@config/index";
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

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

async function fetchWithPuppeteer(url) {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const html = await page.content();
    return html;
  } catch (error) {
    console.error("Error in fetchWithPuppeteer:", error);
    throw error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}

export default async function handler(req, res) {
  const { searchParams } = new URL(req.url, siteUrl);
  let itemUrl = searchParams.get("itemUrl");

  console.log("Received request for itemUrl:", itemUrl);

  try {
    itemUrl = decodeURIComponent(itemUrl);

    if (!itemUrl) {
      throw new ValidationError("Item URL is required");
    }

    console.log("Attempting to fetch with Puppeteer");
    const html = await fetchWithPuppeteer(itemUrl);

    console.log("Successfully fetched content. Length:", html.length);
    console.log("First 200 characters:", html.substring(0, 200));

    res.status(200).send(html);
  } catch (error) {
    console.error("Error in handler:", error);
    return handleError(error, itemUrl, res);
  }
}

function handleError(error, itemUrl, res) {
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

  res.status(status).json({ error: message });
}
