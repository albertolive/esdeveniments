import * as Sentry from "@sentry/nextjs";
import { normalizeEvent, normalizeEvents } from "@utils/normalize";

function insertItemsRandomlyWithMinDistance(array, newItems, minDistance = 3) {
  const newArray = [...array];
  // Shuffle the new items
  newItems.sort(() => Math.random() - 0.5);

  // Insert the new items into the array at random positions
  newItems.forEach((item) => {
    let randomIndex;
    let isValidIndex = false;

    // Find a valid random index
    while (!isValidIndex) {
      randomIndex = Math.floor(Math.random() * (array.length + 1));

      // Check if the new item would be too close to any other new item
      isValidIndex = array
        .slice(
          Math.max(0, randomIndex - minDistance),
          randomIndex + minDistance
        )
        .every((element) => !newItems.includes(element));
    }

    newArray.splice(randomIndex, 0, item);
  });

  return newArray;
}

async function fetchDataWithRetry(url, options = {}, retries = 3) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts left.`);
      return await fetchDataWithRetry(url, options, retries - 1);
    } else {
      throw error;
    }
  }
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

export async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=cardedeu&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP}&units=metric&lang=ca`;

  return await fetch(url)
    .then(async (response) => {
      const data = await response.json();
      if (!data || !data.list) {
        console.error("Something went wrong with openweathermap, data");
        Sentry.captureException(
          "Something went wrong with openweathermap",
          data
        );
        return {};
      }

      return data.list.reduce((days, row) => {
        const date = row.dt_txt;
        days[date] = [...(days[date] ? days[date] : []), row];
        return days;
      }, {});
    })
    .catch((error) => {
      console.error("Something went wrong with openweathermap", error);
      Sentry.captureException(
        "Something went wrong with openweathermap",
        error
      );
      // Return a default value or an error object to handle the failure
      return {};
    });
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
  maxResults = 10,
  filterByDate = true,
}) {
  const fromDate = from.toISOString();
  const untilDate = until ? `&timeMax=${until.toISOString()}` : "";
  const query = q ? `&q=${q}` : "";
  const gcalUrl = `https://www.googleapis.com/calendar/v3/calendars/${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR}@group.calendar.google.com/events?timeMin=${fromDate}${untilDate}${query}&singleEvents=true&orderBy=startTime&maxResults=${maxResults}&key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID}`;

  const [gcalResponse, weather] = await Promise.all([
    fetch(gcalUrl),
    getWeather(),
  ]);

  const events = await gcalResponse.json();

  let normalizedEvents;
  let items = events?.items?.filter((i) => !i.summary.includes("Ad"));

  try {
    normalizedEvents = items
      ? filterByDate
        ? filterByDateFn(items).map((item) =>
            normalizeItems(item, weather, normalizeRss)
          )
        : items.map((item) => normalizeItems(item, weather, normalizeRss))
      : [];
  } catch (e) {
    console.error(e);
    return [];
  }

  if (normalizedEvents.length) {
    const adEvent = {
      id: 0,
      isAd: true,
      images: [],
      location: "",
      slug: "",
    };

    const ads = Array.from({ length: normalizedEvents.length / 4 }, (_, i) => ({
      ...adEvent,
      id: i,
    }));

    normalizedEvents = insertItemsRandomlyWithMinDistance(
      normalizedEvents,
      ads
    );
  }

  return {
    events: normalizedEvents,
    noEventsFound: normalizedEvents.length === 0,
  };
}
