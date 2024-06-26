import { captureException } from "@sentry/nextjs";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const itemUrl = searchParams.get("itemUrl");

  if (!itemUrl) {
    const error = new Error("Item URL is required");
    captureException(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch(itemUrl, {
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

    const arrayBuffer = await response.arrayBuffer();
    let decoder = new TextDecoder("utf-8");
    let html = decoder.decode(arrayBuffer);

    if (html.includes("�")) {
      decoder = new TextDecoder("iso-8859-1");
      html = decoder.decode(arrayBuffer);
    }

    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    captureException(error);
    return new Response(
      JSON.stringify({
        error: `Failed to fetch HTML content: ${error.message}`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
