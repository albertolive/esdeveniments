import axios from "axios";
import { kv } from "@vercel/kv";
import { google } from "googleapis";
import * as cheerio from "cheerio";
import Bottleneck from "bottleneck";
import { CITIES_DATA } from "@utils/constants";

const { XMLParser } = require("fast-xml-parser");
const parser = new XMLParser();
const limiter = new Bottleneck({ maxConcurrent: 3, minTime: 500 });

const calendar = google.calendar("v3");
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  },
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

// Configuration
const PROCESSED_ITEMS_KEY = "processedItems";
const RSS_FEED_CACHE_KEY = "rssFeedCache";
const MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days
const RSS_FEED_CACHE_MAX_AGE = 60 * 60 * 1000; // 1 hour

// Custom error class for RSS feed errors
class RSSFeedError extends Error {
  constructor(message) {
    super(message);
    this.name = "RSSFeedError";
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isCacheValid(cachedData) {
  return (
    cachedData && Date.now() - cachedData.timestamp < RSS_FEED_CACHE_MAX_AGE
  );
}

// Fetches the RSS feed and returns the parsed data
async function fetchRSSFeed(rssFeed, town) {
  try {
    // Check if the data is cached
    const cachedData = await kv.get(`${town}_${RSS_FEED_CACHE_KEY}`);

    if (isCacheValid(cachedData)) {
      console.log(`Returning cached data for ${town}`);
      return cachedData.data;
    }

    // Fetch the data
    const response = await axios.get(rssFeed);

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
    await kv.set(`${town}_${RSS_FEED_CACHE_KEY}`, {
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

async function getProcessedItems(town) {
  const processedItems = await kv.get(`${town}_${PROCESSED_ITEMS_KEY}`);
  return processedItems ? new Map(processedItems) : new Map();
}

async function setProcessedItems(processedItems, town) {
  console.log(`Setting processed items for ${town}`);
  await kv.set(`${town}_${PROCESSED_ITEMS_KEY}`, [...processedItems]);
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

function replaceImageUrl(imageUrl, baseUrl) {
  if (imageUrl) {
    imageUrl = imageUrl.replace(/src="\/media/g, `src="${baseUrl}/media`);
    imageUrl = imageUrl.replace(/href="\/media/g, `href="${baseUrl}/media`);
    // Force HTTPS for src and href attributes
    imageUrl = imageUrl.replace(/src="http:/g, 'src="https:');
    imageUrl = imageUrl.replace(/href="http:/g, 'href="https:');
    return imageUrl;
  }
  return null;
}

function getBaseUrl(url) {
  const urlObject = new URL(url);
  return `${urlObject.protocol}//${urlObject.host}`;
}

async function scrapeDescription(url, descriptionSelector, imageSelector) {
  try {
    const sanitizeUrl = url.replace(/\.html$/, "");
    const response = await fetch(sanitizeUrl);
    const html = await response.text();
    const $ = cheerio.load(html);

    const description =
      $(descriptionSelector).html()?.trim() ||
      "Cap descripció. Afegeix-ne una!";
    let image = $(imageSelector).prop("outerHTML")?.trim();

    // Remove styles and classes from the image
    if (image) {
      let $img = cheerio.load(image);
      $img("*").removeAttr("style");
      $img("*").removeAttr("class");
      image = $img("a").prop("outerHTML");
      image = replaceImageUrl(image, getBaseUrl(url));
    }

    const appendUrl = `\n\nMés informació a:\n\n<a href="${url}">${url}</a>`;

    return `
    <div>${description}</div>\n\n
    ${image ? `<div class="hidden">${image}</div>` : ""}
    <div>${appendUrl}</div>`;
  } catch (error) {
    console.error("Error occurred during scraping description:", url);
    throw error;
  }
}

function getLocationFromHtml(html) {
  // Define the regular expression pattern to match the location
  const pattern = /(?:Al|A la|A les \d+ h, a|Espai|al|a la|A ) ([^<.,]+)/g;

  // Use the matchAll method to find all matches in the HTML text
  const matches = [...html.matchAll(pattern)];

  // Map the matches to an array of locations
  const locations = matches.map((match) => match[1]);

  // Return the array of matched locations
  return locations;
}

async function scrapeLocation(url, location, locationSelector) {
  try {
    if (location) return location;

    const sanitizeUrl = url.replace(/\.html$/, "");
    const response = await fetch(sanitizeUrl);
    const html = await response.text();
    const $ = cheerio.load(html);

    const locationElement = $(locationSelector)
      .find("p, span")
      .map((_, el) => $(el).text())
      .get()
      .join(" ");
    const locationFromHtml =
      locationElement && getLocationFromHtml(locationElement);

    return Array.isArray(locationFromHtml) && locationFromHtml[0]
      ? locationFromHtml[0].trim()
      : location;
  } catch (error) {
    console.error("Error occurred during scraping locataion:", url);
    throw error;
  }
}

async function insertItemToCalendar(
  item,
  town,
  regionLabel,
  townLabel,
  descriptionSelector,
  imageSelector,
  locationSelector,
  processedItems
) {
  if (!item) return;
  const { pubDate, title, link, guid, location = "" } = item || {};
  const dateTime = new Date(pubDate);
  const endDateTime = new Date(dateTime);
  endDateTime.setHours(endDateTime.getHours() + 1);
  const description = link
    ? await scrapeDescription(link, descriptionSelector, imageSelector)
    : null;

  const scrapedLocation = await scrapeLocation(
    link,
    location,
    locationSelector
  );

  const event = {
    summary: title,
    description,
    location: scrapedLocation
      ? `${scrapedLocation}, ${townLabel}, ${regionLabel}`
      : `${townLabel}, ${regionLabel}`,
    start: {
      dateTime: dateTime.toISOString(),
      timeZone: "Europe/Madrid",
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: "Europe/Madrid",
    },
  };

  try {
    const authToken = await auth.getClient();

    await calendar.events.insert({
      auth: authToken,
      calendarId: `${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR}@group.calendar.google.com`,
      resource: event,
    });

    console.log("Inserted new item successfully: " + title);

    const now = Date.now();
    processedItems.set(guid, now);
    await setProcessedItems(processedItems, town); // Save the processed item immediately
    console.log(`Added item ${guid} to processed items`);
    return;
  } catch (error) {
    console.error("Error inserting item to calendar:", error);
    throw error;
  }
}

async function insertItemToCalendarWithRetry(
  item,
  town,
  regionLabel,
  townLabel,
  descriptionSelector,
  imageSelector,
  locationSelector,
  processedItems
) {
  if (!item) return null;

  const MAX_RETRIES = 3;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await insertItemToCalendar(
        item,
        town,
        regionLabel,
        townLabel,
        descriptionSelector,
        imageSelector,
        locationSelector,
        processedItems
      );
    } catch (error) {
      console.error("Error inserting item to calendar:", error);
      retries++;
      // Implement a delay before retrying (exponential backoff)
      await delay(Math.pow(2, retries) * 1000); // 2 seconds, 4 seconds, 8 seconds, etc.
    }
  }

  // If the maximum number of retries is reached, return null to indicate failure
  return null;
}

export default async function handler(req, res) {
  try {
    const { region, town } = req.query;

    // Check if the region parameter is provided
    if (!region) {
      throw new Error("Region parameter is missing");
    }

    // Check if the town parameter is provided
    if (!town) {
      throw new Error("Town parameter is missing");
    }

    // Check if the region exists in the CITIES_DATA map
    if (!CITIES_DATA.has(region)) {
      throw new Error("Region not found");
    }

    const { label: regionLabel, towns } = CITIES_DATA.get(region);

    // Check if the town exists in the townsData map
    if (!towns.has(town)) {
      throw new Error("Town not found");
    }

    // Retrieve the rssFeed value for the given town
    const {
      label: townLabel,
      rssFeed,
      descriptionSelector,
      imageSelector,
      locationSelector,
    } = towns.get(town);

    // Check if the rssFeed is available
    if (!rssFeed) {
      throw new Error("RSS feed URL not found for the town");
    }

    // Fetch the RSS feed
    const items = await fetchRSSFeed(rssFeed, town);

    // Read the database
    const processedItems = await getProcessedItems(town);
    await cleanProcessedItems(processedItems);

    // Filter out already fetched items
    const newItems = items.filter((item) => !processedItems.has(item.guid));

    // If no new items, log a message
    if (newItems.length === 0) {
      console.log(`No new items found for ${town}`);
      return;
    }

    // Insert items in GCal
    for (const item of newItems) {
      await limiter.schedule(async () => {
        try {
          await insertItemToCalendarWithRetry(
            item,
            town,
            regionLabel,
            townLabel,
            descriptionSelector,
            imageSelector,
            locationSelector,
            processedItems
          );
        } catch (error) {
          console.error("Error inserting item to calendar:", error);
        }
      });
    }

    console.log(`Finished processing items for ${town}`);
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
