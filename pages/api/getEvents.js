import { today, week, weekend, twoWeeksDefault } from "@lib/dates";
import { getCalendarEvents } from "@lib/helpers";

const noEventsFound = async (events) => {
  const { from, until } = twoWeeksDefault();

  events = await getCalendarEvents({ from, until, maxResults: 7 });
  events = { ...events, noEventsFound: true };

  return events;
};

const handler = async (req, res) => {
  const { page, q, maxResults, shuffleItems } = req.query;

  let events = [];

  switch (page) {
    case "today":
      const { from: fromToday, until: untilToday } = today();

      events = await getCalendarEvents({
        from: fromToday,
        until: untilToday,
        q,
        maxResults,
        shuffleItems,
      });

      if (events.noEventsFound) events = await noEventsFound(events);

      break;
    case "week":
      const { from: fromWeek, until: toWeek } = week();

      events = await getCalendarEvents({
        from: fromWeek,
        until: toWeek,
        q,
        maxResults,
        shuffleItems,
      });

      if (events.noEventsFound) events = await noEventsFound(events);

      break;
    case "weekend":
      const { from: fromWeekend, until: toWeekend } = weekend();

      events = await getCalendarEvents({
        from: fromWeekend,
        until: toWeekend,
        q,
        maxResults,
        shuffleItems,
      });

      if (events.noEventsFound) events = await noEventsFound(events);

      break;
    case "search":
      const fromSearch = new Date();

      events = await getCalendarEvents({ from: fromSearch, q, shuffleItems });

      if (events.noEventsFound) events = await noEventsFound(events);

      break;
    default:
      const from = new Date();

      events = await getCalendarEvents({ from, q, maxResults, shuffleItems });
  }

  try {
    res.setHeader("Cache-Control", "public, max-age=1800, must-revalidate");
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
  }
};

export default handler;
