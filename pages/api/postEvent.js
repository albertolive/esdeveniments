import { captureException } from "@sentry/nextjs";
import { postToGoogleCalendar } from "@lib/apiHelpers";

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
      const { data } = await postToGoogleCalendar(event);

      console.log("Inserted new item successfully: " + title);
      res.status(200).json(data);
    } catch (error) {
      const errorMessage = `Error inserting item to calendar in postEvent API: ${error.message}`;
      console.error(errorMessage);
      captureException(new Error(errorMessage));
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage = `Error in postEvent API: ${error.message}`;
    console.error(errorMessage);
    captureException(new Error(errorMessage));
    res.status(500).json({ error: errorMessage });
  }
};

export default handler;

export const config = {
  runtime: "edge",
};
