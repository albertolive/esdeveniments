import { captureException } from "@sentry/nextjs";
import { postToGoogleCalendar } from "@lib/apiHelpers";
import axios from "axios";
import { env } from "@utils/helpers";

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

      if (env === "prod") {
        try {
          await axios.post(process.env.NEXT_PUBLIC_NEW_EVENT_EMAIL_URL, {
            title: title,
          });
        } catch (error) {
          console.error(`Error notifying new manual event: ${error.message}`);
          captureException(
            new Error(`Error notifying new manual event: ${error.message}`)
          );
          // No need to throw the error since you want to continue execution
        }
      }

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
