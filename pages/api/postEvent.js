import { google } from "googleapis";
import { captureException } from "@sentry/nextjs";

const calendar = google.calendar("v3");
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  },
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const handler = async (req, res) => {
  try {
    const { title, description, location, startDate, endDate, imageUploaded } =
      req.body;
    const event = {
      summary: title,
      description,
      location,
      start: {
        dateTime: startDate,
        timeZone: "Europe/Madrid",
      },
      end: {
        dateTime: endDate,
        timeZone: "Europe/Madrid",
      },
      guestsCanInviteOthers: imageUploaded,
      guestsCanModify: imageUploaded,
    };

    try {
      const authToken = await auth.getClient();
      const { data } = await calendar.events.insert({
        auth: authToken,
        calendarId: `${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR}@group.calendar.google.com`,
        resource: event,
      });

      console.log("Inserted new item successfully: " + title);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error inserting item to calendar:", error);
      captureException(error);
      throw error;
    }
  } catch (error) {
    console.error(error);
    captureException(error);
    res.status(500).json({ error });
  }
};

export default handler;
