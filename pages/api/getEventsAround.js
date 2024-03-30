import { captureException } from "@sentry/nextjs";
import nlp from "compromise";
import stats from "compromise-stats";
import { normalizeAroundEvents } from "@utils/normalize";

// Reusable function to fetch events
async function fetchEvents(
  queryBatch,
  fromDate,
  maxResultsPerKeyword,
  existingEventIds
) {
  let fetchedEvents = [];
  for (const query of queryBatch) {
    const queryString = `q=${encodeURIComponent(query)}`;
    const url = `https://www.googleapis.com/calendar/v3/calendars/${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR}@group.calendar.google.com/events?timeMin=${fromDate}&${queryString}&singleEvents=true&orderBy=startTime&maxResults=${maxResultsPerKeyword}&key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID}`;
    const response = await fetch(url).then((res) => res.json());
    const events = response.items || [];
    // Filter out events that have already been fetched
    const uniqueEvents = events.filter(
      (event) => !(event.id in existingEventIds)
    );
    // Add unique events to the fetchedEvents array
    fetchedEvents.push(...uniqueEvents);
    // Update the existingEventIds map to include the IDs of the newly fetched events
    uniqueEvents.forEach((event) => (existingEventIds[event.id] = true));
  }
  return fetchedEvents;
}

const handler = async (req, res) => {
  const { id, title, town, region } = req.query;
  const from = new Date();
  const fromDate = from.toISOString();
  const maxResultsPerKeyword = 2;
  const maxQueriesPerRequest = 50;
  const maxEventsLimit = 10;

  const nlpEx = nlp.extend(stats);
  const doc = nlpEx(title);
  const ngramData = doc.ngrams({ max: 3 });
  const keyPhrases = ngramData
    .sort((a, b) => b.size - a.size || b.count - a.count)
    .slice(0, 3)
    .map((entry) => entry.normal);

  let allEvents = [];
  let existingEventIds = {}; // Object to track existing event IDs for deduplication

  try {
    const searchStrategies = [
      (phrase) => phrase.trim(),
      () => `${town}`.trim(),
      () => `${region}`.trim(),
    ];

    const processAndBatchQueries = async (queries) => {
      for (
        let i = 0;
        i < queries.length && allEvents.length < maxEventsLimit;
        i += maxQueriesPerRequest
      ) {
        const queryBatch = queries.slice(i, i + maxQueriesPerRequest);
        const batchEvents = await fetchEvents(
          queryBatch,
          fromDate,
          maxResultsPerKeyword * queryBatch.length,
          existingEventIds
        );
        allEvents = [...allEvents, ...batchEvents];
        if (allEvents.length >= maxEventsLimit) {
          break;
        }
      }
    };

    for (const strategy of searchStrategies) {
      if (allEvents.length < maxEventsLimit) {
        let searchQueries;
        if (strategy.length) {
          searchQueries = keyPhrases.map(strategy);
        } else {
          searchQueries = [strategy()];
        }
        await processAndBatchQueries(searchQueries);
      } else {
        break;
      }
    }

    if (allEvents.length > maxEventsLimit) {
      allEvents = allEvents.slice(0, maxEventsLimit);
    }

    allEvents = allEvents.filter(
      (event) => event.id.toString() !== id.toString()
    );
    allEvents = allEvents.map((event) => normalizeAroundEvents(event));

    res.setHeader("Cache-Control", "public, max-age=900, must-revalidate");
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      events: allEvents,
      noEventsFound: allEvents.length === 0,
    });
  } catch (error) {
    console.error(error);
    captureException(
      new Error(`Error fetching around calendar events: ${error}`)
    );
    res.setHeader("Cache-Control", "public, max-age=900, must-revalidate");
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      events: [],
      noEventsFound: true,
      error: "Error fetching around calendar events",
    });
  }
};

export default handler;
