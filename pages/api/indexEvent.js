import axios from "axios";
import { captureException } from "@sentry/nextjs";
import { getAuthToken } from "@lib/auth";

export default async function handler(req, res) {
  const { url } = req.body;

  try {
    const token = await getAuthToken("indexing");

    const data = JSON.stringify({
      url: url,
      type: "URL_UPDATED",
    });

    const config = {
      method: "post",
      url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios(config);
    console.log(response.data);
    res.status(200).json({ message: "Event indexed successfully" });
  } catch (err) {
    let errorMessage = `Error occurred while indexing URL ${url}: ${err.message}`;

    if (err.response) {
      errorMessage += `\nResponse data: ${JSON.stringify(
        err.response.data
      )}\nResponse status: ${
        err.response.status
      }\nResponse headers: ${JSON.stringify(err.response.headers)}`;

      // Check if the error code is 429 and avoid sending it to Sentry
      if (err.response.status === 429) {
        console.error(
          "Rate limit exceeded, not sending to Sentry:",
          errorMessage
        );
      } else {
        captureException(new Error(errorMessage));
      }
    } else if (err.request) {
      errorMessage += `\nRequest: ${JSON.stringify(err.request)}`;
      // For errors related to the request without a response, still capture them
      captureException(new Error(errorMessage));
    } else {
      // For other types of errors, capture them as well
      captureException(new Error(errorMessage));
    }

    console.error(errorMessage);
    res.status(500).json({ error: errorMessage });
  }
}
