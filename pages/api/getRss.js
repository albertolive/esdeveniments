import { XMLParser } from "fast-xml-parser";
import { captureException } from "@sentry/nextjs";

export const config = {
  runtime: "edge",
};

const parser = new XMLParser();

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const rssFeed = searchParams.get("rssFeed");

  if (!rssFeed) {
    const error = new Error("RSS feed URL is required");
    captureException(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch(rssFeed, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      captureException(error);
      throw error;
    }

    const data = await response.text();
    const json = parser.parse(data);

    if (
      !json ||
      !json.rss ||
      !json.rss.channel ||
      !Array.isArray(json.rss.channel.item)
    ) {
      const error = new Error("Invalid RSS data format or no items in feed");
      captureException(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.log("json.rss.channel.item", json.rss.channel.item);
    return new Response(JSON.stringify(json.rss.channel.item), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    captureException(error);
    return new Response(
      JSON.stringify({ error: `Failed to fetch RSS feed: ${error.message}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
