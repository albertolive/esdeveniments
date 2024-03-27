import { captureException } from "@sentry/nextjs";
import { normalizeEvent, normalizeEvents } from "@utils/normalize";
import { env } from "@utils/helpers";

function insertAdsRandomly(
  array,
  ads,
  minDistance = 5,
  maxDistance = 8,
  startFrom = 3
) {
  const newArray = [...array];
  // Shuffle the ads
  ads.sort(() => Math.random() - 0.5);

  // Create an array to keep track of indexes where ads have been inserted
  let insertedIndexes = [];

  // Insert the ads into the array at random positions
  ads.forEach((ad, i) => {
    // Calculate the index for the ad based on the min and max distance
    let index =
      startFrom +
      i * minDistance +
      Math.floor(Math.random() * (maxDistance - minDistance + 1));

    // Check if the index is valid
    if (index < newArray.length) {
      // Insert the ad at the calculated index
      newArray.splice(index, 0, ad);
      // Add the index to the insertedIndexes array
      insertedIndexes.push(index);
    }
  });

  return newArray;
}

const now = new Date();

const filterByDateFn = (items) =>
  items
    .map((item) => {
      const startDate = new Date(item.start.dateTime);

      if (startDate < now) {
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          startDate.getHours(),
          startDate.getMinutes()
        );

        return {
          ...item,
          start: { dateTime: today },
          originalStartDate: item.start.dateTime,
        };
      }

      return item;
    })
    .sort((a, b) => {
      return new Date(a.start.dateTime) - new Date(b.start.dateTime);
    })
    .map((item) => {
      if (item.originalStartDate) {
        return {
          ...item,
          start: { dateTime: item.originalStartDate },
        };
      }
      return item;
    });

const normalizeItems = (item, weather, normalizeRss) =>
  normalizeRss ? normalizeEvent(item) : normalizeEvents(item, weather);

export async function getWeather(normalizeRss) {
  if (normalizeRss || env !== "prod") return {};

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=cardedeu&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP}&units=metric&lang=ca`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      // Handle non-2xx responses
      const errorMessage = `OpenWeatherMap API error: ${response.status} ${response.statusText}`;
      console.error(errorMessage, data);

      // Decide whether to send to Sentry based on status code
      if (![404, 429].includes(response.status)) {
        // Send unexpected errors to Sentry
        captureException(new Error(errorMessage), { extra: data });
      }

      return {};
    }

    if (!data || !data.list) {
      console.error("Unexpected response format from OpenWeatherMap", data);
      // This is an unexpected format issue, consider sending it to Sentry
      captureException(
        new Error("Unexpected response format from OpenWeatherMap"),
        { extra: data }
      );
      return {};
    }

    return data.list.reduce((days, row) => {
      const date = row.dt_txt;
      days[date] = [...(days[date] ? days[date] : []), row];
      return days;
    }, {});
  } catch (error) {
    // Handle network errors or other unexpected errors
    console.error("Failed to fetch weather data from OpenWeatherMap", error);
    captureException(error);
    return {};
  }
}

export async function getCalendarEvent(eventId) {
  if (!eventId) return { event: [] };

  const normalizedEventId = eventId.split(/[-]+/).pop();
  const url = `https://www.googleapis.com/calendar/v3/calendars/${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR}@group.calendar.google.com/events/${normalizedEventId}?key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID}`;
  const res = await fetch(url);
  const json = await res.json();
  const normalizedEvent = normalizeEvent(json);

  return { event: normalizedEvent };
}

export async function getCalendarEvents({
  from,
  until,
  normalizeRss = false,
  q = "",
  maxResults = 15,
  filterByDate = true,
  shuffleItems = false,
}) {
  try {
    const fromDate = from.toISOString();
    const untilDate = until ? `&timeMax=${until.toISOString()}` : "";
    const gcalUrl = `https://www.googleapis.com/calendar/v3/calendars/${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR}@group.calendar.google.com/events?timeMin=${fromDate}${untilDate}&q=${q}&singleEvents=true&orderBy=startTime&maxResults=${maxResults}&key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID}`;

    const [gcalResponse, weather] = await Promise.all([
      fetch(gcalUrl).then((res) => res.json()),
      getWeather(normalizeRss),
    ]);

    let normalizedEvents;
    let items = gcalResponse?.items || [];

    let allEventsLoaded = false;

    if (items.length < maxResults) {
      allEventsLoaded = true;
    }

    items = items.filter((i) => !i.summary.includes("Ad"));

    normalizedEvents = items
      ? filterByDate
        ? filterByDateFn(items).map((item) =>
            normalizeItems(item, weather, normalizeRss)
          )
        : items.map((item) => normalizeItems(item, weather, normalizeRss))
      : [];

    // Shuffle the events only in the server, not in the client
    // if (shuffleItems) {
    //   normalizedEvents = shuffleArray(normalizedEvents);
    // }

    if (normalizedEvents.length) {
      const adEvent = {
        id: 0,
        isAd: true,
        images: [],
        location: "",
        slug: "",
      };

      const ads = Array.from(
        { length: normalizedEvents.length / 4 },
        (_, i) => ({
          ...adEvent,
          id: i,
        })
      );

      normalizedEvents = insertAdsRandomly(normalizedEvents, ads);
    }

    return {
      events: normalizedEvents,
      noEventsFound: normalizedEvents.length === 0,
      allEventsLoaded,
    };
  } catch (e) {
    console.error(e);
    return {
      events: [],
      noEventsFound: true,
    };
  }
}

// eslint-disable-next-line no-unused-vars
function shuffleArray(array) {
  const multiDayEvents = [];
  const todaysSingleDayEvents = [];
  const otherEvents = [];

  // Separate the array into different categories in a single iteration
  const today = new Date().toDateString();

  array.forEach((event) => {
    if (event.isMultipleDays) {
      multiDayEvents.push(event);
    } else if (new Date(event.startDate).toDateString() === today) {
      todaysSingleDayEvents.push(event);
    } else {
      otherEvents.push(event);
    }
  });

  // Shuffle the multi-day events
  for (let i = multiDayEvents.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [multiDayEvents[i], multiDayEvents[j]] = [
      multiDayEvents[j],
      multiDayEvents[i],
    ];
  }

  // Concatenate today's single-day events, multi-day events, and other events
  return todaysSingleDayEvents.concat(multiDayEvents, otherEvents);
}
