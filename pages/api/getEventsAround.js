import { captureException } from "@sentry/nextjs";
import nlp from "compromise";
import stats from "compromise-stats";
import { normalizeAroundEvents } from "@utils/normalize";

// Reusable function to fetch events
async function fetchEvents(queryBatch, fromDate, maxResultsPerKeyword) {
  let allEvents = [];
  for (const query of queryBatch) {
    const queryString = `q=${encodeURIComponent(query)}`;
    const url = `https://www.googleapis.com/calendar/v3/calendars/${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR}@group.calendar.google.com/events?timeMin=${fromDate}&${queryString}&singleEvents=true&orderBy=startTime&maxResults=${maxResultsPerKeyword}&key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID}`;
    const response = await fetch(url).then((res) => res.json());
    const events = response.items || [];
    const uniqueEvents = events.filter(
      (event) => !allEvents.some((e) => e.id === event.id)
    );
    allEvents = [...allEvents, ...uniqueEvents];
  }
  return allEvents;
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

  try {
    const searchStrategies = [
      (phrase) => phrase.trim(), // First, search with phrase
      () => `${town}`.trim(), // Next, just the town
      () => `${region}`.trim(), // Then, just the region
    ];

    // Function to process and batch queries
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
          maxResultsPerKeyword * queryBatch.length
        );
        allEvents = [...allEvents, ...batchEvents];
        if (allEvents.length >= maxEventsLimit) {
          break; // Stop fetching more events if we've reached the limit
        }
      }
    };

    // Iterate through search strategies until enough results are found, all strategies are tried, or the maximum limit is reached
    for (const strategy of searchStrategies) {
      if (allEvents.length < maxEventsLimit) {
        let searchQueries;
        if (strategy.length) {
          // Check if strategy expects an argument
          searchQueries = keyPhrases.map(strategy);
        } else {
          searchQueries = [strategy()]; // Strategy does not expect an argument
        }
        await processAndBatchQueries(searchQueries);
      } else {
        break; // Exit the loop if we have reached the maximum number of events
      }
    }

    // If we have more than the maximum limit of events, trim the list
    if (allEvents.length > maxEventsLimit) {
      allEvents = allEvents.slice(0, maxEventsLimit);
    }

    // Filter out the event with the same ID as provided in the query
    allEvents = allEvents.filter(
      (event) => event.id.toString() !== id.toString()
    );

    // Normalize the events
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
    // Set headers and return an empty array with a flag indicating no events were found
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
