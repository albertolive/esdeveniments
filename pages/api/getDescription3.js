import axios from "axios";

export const config = {
  runtime: "edge",
};

async function fetchHtmlContent(
  url,
  encoding = "utf-8",
  maxRetries = 3,
  delay = 1000
) {
  let retries = maxRetries;

  while (retries > 0) {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const decoder = new TextDecoder(encoding);
      return decoder.decode(response.data);
    } catch (error) {
      retries--;
      console.error("Error fetching HTML content, retries left: ", retries);
      if (retries === 0) {
        throw new Error(
          `Error fetching HTML content. Status: ${error.response?.status}, Message: ${error.message}`
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const encoding = searchParams.get("encoding") || "utf-8";

  if (!url) {
    return new Response(
      JSON.stringify({ error: "URL parameter is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    console.log(`Attempting to fetch URL: ${url}`);
    const html = await fetchHtmlContent(url, encoding);
    console.log(`Successfully fetched HTML. Length: ${html.length}`);

    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error("Error in handler:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
