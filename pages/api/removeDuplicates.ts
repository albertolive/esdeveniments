import { captureException } from "@sentry/nextjs";
import Bottleneck from "bottleneck";
import axios from "axios";
import { getAuthToken } from "@lib/auth";

const limiter = new Bottleneck({ maxConcurrent: 3, minTime: 500 });

async function deleteEvent(token, eventId, summary) {
  try {
    await axios.delete(
      `https://www.googleapis.com/calendar/v3/calendars/${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR}@group.calendar.google.com/events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`Deleted event with ID: ${eventId}, Summary: ${summary}`);
  } catch (err) {
    console.error(
      `Failed to delete event with ID: ${eventId}, Summary: ${summary}`,
      err
    );
    captureException(
      new Error(
        `Failed to delete event with ID: ${eventId}, Summary: ${summary}: ${err.message}`
      )
    );
  }
}

function generateKey(event) {
  const summary = event.summary ? event.summary.toLowerCase().trim() : "";
  const location = event.location ? event.location.toLowerCase().trim() : "";
  const startDate = new Date(event.start.dateTime || event.start.date);
  const endDate = new Date(event.end.dateTime || event.end.date);

  return `${summary}-${startDate.toISOString().split("T")[0]}-${
    endDate.toISOString().split("T")[0]
  }-${location}`;
}

export default async function handler(_, res) {
  try {
    const token = await getAuthToken();

    // Calculate the date one week before and one week after today
    const numDaysBefore = process.env.NEXT_PUBLIC_NUM_DAYS_BEFORE || 2;
    const numDaysAfter = process.env.NEXT_PUBLIC_NUM_DAYS_AFTER || 2;
    const timeMin = new Date();
    timeMin.setDate(timeMin.getDate() - numDaysBefore);
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + numDaysAfter);

    // Fetch all events from the calendar
    const { data } = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR}@group.calendar.google.com/events`,
      {
        params: {
          timeMin: timeMin.toISOString(),
          timeMax: timeMax.toISOString(),
          maxResults: 2500,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const events = data.items;

    // Create a map to store the count of each event
    const eventCount = new Map();

    // Iterate over the events
    for (const event of events) {
      const key = generateKey(event);

      // Increment the count for this event
      eventCount.set(key, (eventCount.get(key) || 0) + 1);
    }

    // Find the events that have a count greater than 1 (i.e., duplicates)
    const duplicates = Array.from(eventCount.entries()).filter(
      ([, count]) => count > 1
    );

    // Log the duplicates
    console.log("Duplicates:", duplicates);

    // Delete duplicates
    let duplicatesDeleted = false;
    let deletedEventSummaries = new Map(); // Map to store the count of deleted events for each summary
    for (const [key] of duplicates) {
      // Find all events with this key
      const duplicateEvents = events.filter((event) => {
        const eventKey = generateKey(event);

        return eventKey === key;
      });

      // Sort the duplicate events by start time in descending order
      duplicateEvents.sort((a, b) => {
        const aStartTime = new Date(a.start.dateTime || a.start.date);
        const bStartTime = new Date(b.start.dateTime || b.start.date);
        return bStartTime - aStartTime; // For descending order
      });

      // Delete all but the most recent duplicate event
      for (let i = 1; i < duplicateEvents.length; i++) {
        await limiter.schedule(() =>
          deleteEvent(token, duplicateEvents[i].id, duplicateEvents[i].summary)
        );
        duplicatesDeleted = true;
        deletedEventSummaries.set(
          duplicateEvents[i].summary,
          (deletedEventSummaries.get(duplicateEvents[i].summary) || 0) + 1
        );
      }
    }

    // Send the response
    if (duplicatesDeleted) {
      res.status(200).json({
        message: "Duplicates deleted",
        deletedEventSummaries: Array.from(deletedEventSummaries.entries()),
      });
    } else {
      res.status(200).json({ message: "No duplicates found" });
    }
  } catch (err) {
    console.error(err.message);
    captureException(new Error(`Error in handler: ${err.message}`));
    res.status(500).json({
      error: `An error occurred while checking for and deleting duplicate events: ${err.message}`,
    });
  }
}
