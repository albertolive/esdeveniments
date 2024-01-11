import { google } from "googleapis";
import axios from "axios";
import { captureException } from "@sentry/nextjs";

export default async function handler(req, res) {
  const { url } = req.body;

  const jwtClient = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY,
    ["https://www.googleapis.com/auth/indexing"],
    null
  );

  try {
    const tokens = await jwtClient.authorize();

    const data = JSON.stringify({
      url: url,
      type: "URL_UPDATED",
    });

    const config = {
      method: "post",
      url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
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
    } else if (err.request) {
      errorMessage += `\nRequest: ${JSON.stringify(err.request)}`;
    }

    console.error(errorMessage);
    captureException(new Error(errorMessage));
    res.status(500).json({ error: errorMessage });
  }
}
