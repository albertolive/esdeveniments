import { captureException } from "@sentry/nextjs";
import { today, tomorrow, week, weekend, twoWeeksDefault } from "@lib/dates";
import { getCalendarEvents } from "@lib/helpers";
import { getRegionFromQuery } from "@utils/helpers";

const noEventsFound = async (events, query, town) => {
  const { from, until } = twoWeeksDefault();
  const q = getRegionFromQuery(query);

  events = await getCalendarEvents({
    from,
    until,
    q,
    maxResults: 7,
    town,
  });
  events = { ...events, noEventsFound: true };

  return events;
};

const getEvents = async ({
  from,
  until,
  q,
  maxResults,
  shuffleItems,
  town,
}) => {
  let events;
  try {
    events = await getCalendarEvents({
      from,
      until,
      q,
      maxResults,
      shuffleItems,
      town,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching calendar events");
  }

  if (events.noEventsFound) {
    events = await noEventsFound(events, q, town);
  }

  return events;
};

const handler = async (req, res) => {
  const { page, q, maxResults, shuffleItems, town } = req.query;

  let events = [];

  switch (page) {
    case "today": {
      const { from: fromToday, until: untilToday } = today();
      events = await getEvents({
        from: fromToday,
        until: untilToday,
        q,
        maxResults,
        shuffleItems,
        town,
      });
      break;
    }
    case "tomorrow": {
      const { from: fromTomorrow, until: toTomorrow } = tomorrow();

      events = await getEvents({
        from: fromTomorrow,
        until: toTomorrow,
        q,
        maxResults,
        shuffleItems,
        town,
      });
      break;
    }
    case "week": {
      const { from: fromWeek, until: toWeek } = week();
      events = await getEvents({
        from: fromWeek,
        until: toWeek,
        q,
        maxResults,
        shuffleItems,
        town,
      });
      break;
    }
    case "weekend": {
      const { from: fromWeekend, until: toWeekend } = weekend();
      events = await getEvents({
        from: fromWeekend,
        until: toWeekend,
        q,
        maxResults,
        shuffleItems,
        town,
      });
      break;
    }
    case "search": {
      const fromSearch = new Date();
      events = await getEvents({
        from: fromSearch,
        q,
        shuffleItems,
        town,
      });
      break;
    }
    default: {
      const from = new Date();
      events = await getEvents({
        from,
        q,
        maxResults,
        shuffleItems,
        town,
      });
    }
  }

  try {
    res.setHeader("Cache-Control", "public, max-age=900, must-revalidate");
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      ...events,
      noEventsFound: events.noEventsFound
        ? events.noEventsFound
        : events.length === 0,
      currentYear: new Date().getFullYear(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
    captureException(new Error(`Error fetching calendar events ${error}`));
  }
};

export default handler;
