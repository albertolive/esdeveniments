import { captureException } from "@sentry/nextjs";
import { updateGoogleCalendarEvent } from "@lib/apiHelpers";

const handler = async (req, res) => {
  try {
    if (req.method !== "PUT") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const {
      id,
      title,
      description,
      location,
      startDate,
      endDate,
      imageUploaded,
      eventUrl,
    } = req.body;

    const cleanedDescription = description.replace(
      /<span id="more-info" class="hidden" data-url="[^"]*"><\/span>/gi,
      ""
    );

    const enhancedDescription = eventUrl
      ? `${cleanedDescription}<span id="more-info" class="hidden" data-url="${eventUrl}"></span>`
      : cleanedDescription;

    const event = {
      id,
      summary: title,
      description: enhancedDescription,
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
      isProduction: process.env.NODE_ENV === "production",
      calendarId: process.env.NEXT_PUBLIC_GOOGLE_CALENDAR,
    };

    try {
      const { data } = await updateGoogleCalendarEvent(event);

      console.log("Updated event successfully: " + title);
      res.status(200).json(data);
    } catch (error) {
      const errorMessage = `Error updating event in editEvent API: ${error.message}`;
      console.error(errorMessage);
      captureException(new Error(errorMessage));
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage = `Error in editEvent API: ${error.message}`;
    console.error(errorMessage);
    captureException(new Error(errorMessage));
    res.status(500).json({ error: errorMessage });
  }
};

export default handler;
