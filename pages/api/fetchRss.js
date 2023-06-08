import axios from "axios";
import { kv } from "@vercel/kv";
import { google } from "googleapis";
import cheerio from "cheerio";

const { XMLParser } = require("fast-xml-parser");
const parser = new XMLParser();

const calendar = google.calendar("v3");
const auth = new google.auth.GoogleAuth({
  keyFile: JSON.parse(process.env.GOOGLE_AUTH_KEYFILE),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

// Configuration
const RSS_FEED_URL = "https://www.cardedeu.cat/rss/12/0/";
const PROCESSED_ITEMS_KEY = "processedItems";
const RSS_FEED_CACHE_KEY = "rssFeedCache";
const MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days
const RSS_FEED_CACHE_MAX_AGE = 60 * 60 * 1000; // 1 hour
let REQUEST_COUNT = 0;
const REQUEST_LIMIT = 1;
const DELAY_IN_MS = 1000;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Custom error class for RSS feed errors
class RSSFeedError extends Error {
  constructor(message) {
    super(message);
    this.name = "RSSFeedError";
  }
}

function isCacheValid(cachedData) {
  return (
    cachedData && Date.now() - cachedData.timestamp < RSS_FEED_CACHE_MAX_AGE
  );
}

// Fetches the RSS feed and returns the parsed data
async function fetchRSSFeed() {
  try {
    // Check if the data is cached
    const cachedData = await kv.get(RSS_FEED_CACHE_KEY);

    if (isCacheValid(cachedData)) {
      console.log("Returning cached data");
      return cachedData.data;
    }

    // Fetch the data
    const response = await axios.get(RSS_FEED_URL);
    const json = parser.parse(response.data);

    // Validate the data
    if (
      !json ||
      !json.rss ||
      !json.rss.channel ||
      !Array.isArray(json.rss.channel.item)
    ) {
      throw new Error("Invalid data format");
    }

    const data = json.rss.channel.item;

    // Cache the data
    await kv.set(RSS_FEED_CACHE_KEY, {
      timestamp: Date.now(),
      data,
    });

    console.log("Returning new RSS data");
    return data;
  } catch (err) {
    console.error(`An error occurred while fetching the RSS feed: ${err}`);
    // Throw a custom error
    throw new RSSFeedError(`Failed to fetch RSS feed: ${err}`);
  }
}

async function getProcessedItems() {
  const processedItems = await kv.get(PROCESSED_ITEMS_KEY);
  return processedItems ? new Map(processedItems) : new Map();
}

async function setProcessedItems(processedItems) {
  await kv.set(PROCESSED_ITEMS_KEY, [...processedItems]);
}

async function getExpiredItems(processedItems) {
  const now = Date.now();
  return [...processedItems].filter(
    ([_, timestamp]) => now - timestamp > MAX_AGE
  );
}

async function removeExpiredItems(processedItems, expiredItems) {
  for (const [item, _] of expiredItems) {
    console.log(`Removing item ${item} from processed items`);
    processedItems.delete(item);
  }
}

async function cleanProcessedItems(processedItems) {
  const expiredItems = await getExpiredItems(processedItems);
  await removeExpiredItems(processedItems, expiredItems);
}

async function scrapeDescription(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const description = $(".ddbbtext").html()?.trim() || "";
    let image = $(".first-image").html()?.trim() || null;

    if (image) {
      image = image.replace(
        'src="/media',
        'src="https://www.cardedeu.cat/media'
      );
    }

    const appendUrl = `\n\nMés informació a:\n\n<a href="${url}">${url}</a>`;

    return `${description}\n${image}\n${appendUrl}`;
  } catch (error) {
    console.error("Error occurred during scraping:", url);
    throw error;
  }
}

async function insertItemToCalendar(item) {
  if (!item) return;

  const { pubDate, title, link, guid, location } = item || {};
  const dateTime = new Date(pubDate);
  const endDateTime = new Date(dateTime);
  endDateTime.setHours(endDateTime.getHours() + 1);
  const description = link ? await scrapeDescription(link) : null;
  const event = {
    summary: title,
    description,
    location: `${location ? location : "Cardedeu"}, Cardedeu, Vallès Oriental`,
    start: {
      dateTime: dateTime.toISOString(),
      timeZone: "UTC",
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: "UTC",
    },
  };

  try {
    const authToken = await auth.getClient();

    await calendar.events.insert({
      auth: authToken,
      calendarId: `${NEXT_PUBLIC_GOOGLE_CALENDAR}@group.calendar.google.com`,
      resource: event,
    });
    console.log("Inserted new item successfully: " + title);
    return guid;
  } catch (error) {
    console.error("Error inserting item to calendar:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  try {
    // Fetch the RSS feed
    const items = await fetchRSSFeed();

    // Read the database
    const processedItems = await getProcessedItems();
    cleanProcessedItems(processedItems);

    // Filter out already fetched items
    const newItems = items.filter((item) => !processedItems.has(item.guid));

    // Insert items in GCal
    const promises = [];
    for (const item of newItems) {
      if (REQUEST_COUNT >= REQUEST_LIMIT) {
        await delay(DELAY_IN_MS);
        promises.push(await insertItemToCalendar(item));
        REQUEST_COUNT++;
      } else {
        promises.push(await insertItemToCalendar(item));
        REQUEST_COUNT++;
      }
      console.log(`Adding item ${item.guid} to processed items`);
    }

    // Update the database
    const results = await Promise.allSettled(promises);
    const now = Date.now();
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        processedItems.set(result.value, now);
      } else {
        console.error("Error inserting item to calendar:", result.reason);
      }
    });
    await setProcessedItems(processedItems);
    console.log("Finished processing items");
    // Send the response
    res.status(200).json(newItems);
  } catch (err) {
    console.error(err);
    if (err instanceof RSSFeedError) {
      // Handle custom RSS feed error
      res.status(500).json({
        error: err.message,
      });
    } else {
      res.status(500).json({
        error: `An error occurred while fetching the RSS feed: ${err.message}`,
      });
    }
  }
}
