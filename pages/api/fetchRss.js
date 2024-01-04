import axios from "axios";
import { kv } from "@vercel/kv";
import { google } from "googleapis";
import { load } from "cheerio";
import Bottleneck from "bottleneck";
import { DateTime } from "luxon";
import { captureException } from "@sentry/nextjs";
import { CITIES_DATA } from "@utils/constants";

const { XMLParser } = require("fast-xml-parser");
const parser = new XMLParser();
const limiter = new Bottleneck({ maxConcurrent: 5, minTime: 300 });

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
const debugMode = false;
const TIMEOUT_LIMIT = 10000;
const SAFETY_MARGIN = 1000;
const PROCESSED_ITEMS_KEY = "processedItems";
const RSS_FEED_CACHE_KEY = "rssFeedCache";
const MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days
const RSS_FEED_CACHE_MAX_AGE = 60 * 60 * 1000; // 1 hour
const env =
  process.env.NODE_ENV !== "production" &&
  process.env.VERCEL_ENV !== "production"
    ? "dev"
    : "prod";

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
    if (env === "prod") {
      // Check if the data is cached
      const cachedData = await kv.get(`${env}_${town}_${RSS_FEED_CACHE_KEY}`);

      if (isCacheValid(cachedData)) {
        console.log(`Returning cached data for ${town}`);
        return cachedData.data;
      }
    }
    // Fetch the data
    const response = await axios.get(rssFeed, { responseType: "arraybuffer" });

    // Check if the response status is not 200
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch Rss data for ${town}: ${response.status}`
      );
    }

    // Try decoding the response data with UTF-8
    let decoder = new TextDecoder("utf-8");
    let data = decoder.decode(response.data);

    // If the decoded data contains unusual characters, try ISO-8859-1
    if (data.includes("�")) {
      decoder = new TextDecoder("iso-8859-1");
      data = decoder.decode(response.data);
    }

    // If response.data is not an array means that is an rss feed
    if (!Array.isArray(data)) {
      const json = parser.parse(data);

      // Validate the data
      if (
        !json ||
        !json.rss ||
        !json.rss.channel ||
        !Array.isArray(json.rss.channel.item)
      ) {
        console.log("Invalid RSS data format or no items in feed");
        return [];
      }

      data = json.rss.channel.item;
    }

    // Cache the data
    if (env === "prod") {
      try {
        await kv.set(`${env}_${town}_${RSS_FEED_CACHE_KEY}`, {
          timestamp: Date.now(),
          data,
        });
      } catch (err) {
        console.error(
          `An error occurred while caching the RSS feed of ${town}: ${err}`
        );
        captureException(
          new Error(`Failed to fetch RSS feed for ${town}: ${err.message}`)
        );
        throw new Error(`Failed to cache RSS feed: ${err}`);
      }
    }

    console.log("Returning new RSS data");
    return data;
  } catch (err) {
    console.error(
      `An error occurred while fetching the RSS feed of ${town}: ${err}`
    );
    // Throw a custom error
    throw new RSSFeedError(`Failed to fetch RSS feed: ${err}`);
  }
}

async function getProcessedItems(town) {
  let processedItems;
  try {
    processedItems = await kv.get(`${env}_${town}_${PROCESSED_ITEMS_KEY}`);
  } catch (err) {
    console.error(`An error occurred while getting processed items: ${err}`);
    captureException(
      new Error(`Failed to get processed items for ${town}: ${err.message}`)
    );
    throw new Error(`Failed to get processed items: ${err}`);
  }
  return processedItems ? new Map(processedItems) : new Map();
}

async function setProcessedItems(processedItems, town) {
  try {
    console.log(`Setting processed items for ${town}`);
    await kv.set(`${env}_${town}_${PROCESSED_ITEMS_KEY}`, [...processedItems]);
  } catch (err) {
    console.error(`An error occurred while setting processed items: ${err}`);
    captureException(
      new Error(`Failed to set processed items for ${town}: ${err.message}`)
    );
    throw new Error(`Failed to set processed items: ${err}`);
  }
}

async function removeExpiredItems(processedItems) {
  const now = Date.now();
  let removedItemsCount = 0;
  for (const [item, timestamp] of processedItems) {
    if (now - timestamp > MAX_AGE) {
      console.log(`Removing item ${item} from processed items`);
      processedItems.delete(item);
      removedItemsCount++;
    }
  }
  console.log(
    `Removed ${removedItemsCount} expired items from processed items`
  );
}

async function cleanProcessedItems(processedItems, town) {
  console.log(
    `Initial processed items count for ${town}: ${processedItems.size}`
  );
  await removeExpiredItems(processedItems);
  console.log(
    `Final processed items count for ${town}: ${processedItems.size}`
  );
  await setProcessedItems(processedItems, town);
}

const getEventImageUrl = (description) => {
  const regex = /(http(s?):)([\/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|JPG)/g;
  const match = description && description.match(regex);
  return match && match[0];
};
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

async function scrapeDescription(
  title,
  url,
  descriptionSelector,
  imageSelector,
  sanitizeUrl = true,
  removeImage = false
) {
  try {
    const sanitizedUrl = sanitizeUrl ? url.replace(/\.html$/, "") : url;

    // Fetch the page and get the response as an ArrayBuffer
    const response = await fetch(sanitizedUrl);
    const arrayBuffer = await response.arrayBuffer();

    // Try decoding the response data with UTF-8
    let decoder = new TextDecoder("utf-8");
    let html = decoder.decode(arrayBuffer);

    // If the decoded data contains unusual characters, try ISO-8859-1
    if (html.includes("�")) {
      decoder = new TextDecoder("iso-8859-1");
      html = decoder.decode(arrayBuffer);
    }

    const $ = load(html);

    let description = $(descriptionSelector).html()?.trim();

    if (description) {
      // Parse the description HTML with cheerio
      let dom = $.parseHTML(description);
      let $desc = $(dom);

      // Find all img tags
      $desc.find("img").each((_, img) => {
        // Get the src attribute
        let src = $(img).attr("src");

        // If the src is a relative URL, prepend the base URL
        if (!src.startsWith("http")) {
          src = new URL(src, getBaseUrl(url)).href;
          $(img).attr("src", src);
        }
      });

      if (removeImage) {
        $desc.find("img").remove();
      }

      // Update the description with the modified HTML
      description = $desc.html();
    } else {
      description =
        "Encara no hi ha descripció. Afegeix-ne una i dóna vida a aquest espai!";
    }

    let rawImage = $(imageSelector).prop("outerHTML")?.trim();
    let image;
    const regex = /(https?:\/\/[^"\s]+)/g;

    if (rawImage) {
      let $img = load(rawImage);
      let img = $img("img");
      img.removeAttr("style");
      img.removeAttr("class");
      let imgOuterHtml;
      if ($img("a").length) {
        imgOuterHtml = $img("a").prop("outerHTML");
      } else {
        imgOuterHtml = $img("img").prop("outerHTML");
      }

      // Handle relative URLs
      let src = $img("img").attr("src");
      if (!src.startsWith("http")) {
        // If the src is a relative URL, prepend the base URL
        src = new URL(src, getBaseUrl(url)).href;
        $img("img").attr("src", src);
        imgOuterHtml = $img.html();
      }

      image = replaceImageUrl(imgOuterHtml, getBaseUrl(url));
    } else if (!removeImage) {
      image = getEventImageUrl(description);
    }

    const result = image && image.match(regex);
    image = result && result[0];

    if (!image) {
      console.error("No image URL found");
    }

    const appendUrl = `<br><br><b>Més informació:</b><br><a class="text-primary" href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>`;

    return `
    <div>${description}</div>
    ${image ? `<div class="hidden">${image}</div>` : ""}
    <div>${appendUrl}</div>`;
  } catch (error) {
    console.error("Error occurred during scraping description:", url);
    captureException(
      new Error(
        `Error occurred during scraping description for ${url}: ${error.message}`
      )
    );
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

  // Return the array of matched locations or null if it's empty
  return locations.length > 0 ? locations : null;
}

async function scrapeLocation(url, location, locationSelector) {
  try {
    if (location) return location;

    const sanitizeUrl = url.replace(/\.html$/, "");
    const response = await fetch(sanitizeUrl);
    const html = await response.text();
    const $ = load(html);

    // TODO: Make it more generic. Now it works for La Garriga
    let locationElement = $(locationSelector).find("p").first().text();

    // If locationElement is an array, take the first element and split it if it's too long
    if (Array.isArray(locationElement)) {
      locationElement = locationElement.map((item) => {
        if (item.length > 100) {
          return item.split(",")[0];
        }
        return item;
      })[0];
    }

    // If the location is too long, split it at the first comma
    if (locationElement && locationElement.length > 100) {
      locationElement = locationElement.split(",")[0];
    }

    return locationElement ? locationElement.trim() : location;
  } catch (error) {
    console.error("Error occurred during scraping location:", url);
    captureException(
      new Error(
        `Error occurred during scraping location for ${url}: ${error.message}`
      )
    );
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
  processedItems,
  authToken,
  removeImage
) {
  if (!item) return;
  const {
    pubDate,
    title,
    link,
    guid,
    location = "",
    "content:encoded": locationExtra,
    date,
  } = item || {};

  const dateTime = DateTime.fromRFC2822(pubDate || date.from, {
    zone: "Europe/Madrid",
  });
  const endDateTime =
    date && date.to
      ? DateTime.fromRFC2822(date.to, { zone: "Europe/Madrid" })
      : dateTime.plus({ hours: 1 });

  const isFullDayEvent = dateTime.toFormat("HH:mm:ss") === "00:00:00";

  const description = link
    ? await scrapeDescription(
        title,
        link,
        descriptionSelector,
        imageSelector,
        town !== "barcelona", // TODO: Remove this when we have a better solution for Barcelona
        removeImage
      )
    : null;

  const scrapedLocation = await scrapeLocation(
    link,
    location || locationExtra,
    locationSelector
  );

  const event = {
    summary: title,
    description,
    location: scrapedLocation
      ? `${scrapedLocation}, ${townLabel}, ${regionLabel}`
      : `${townLabel}, ${regionLabel}`,
    start: isFullDayEvent
      ? { date: dateTime.toFormat("yyyy-MM-dd") }
      : { dateTime: dateTime.toJSDate(), timeZone: "Europe/Madrid" },
    end: isFullDayEvent
      ? { date: endDateTime.toFormat("yyyy-MM-dd") }
      : { dateTime: endDateTime.toJSDate(), timeZone: "Europe/Madrid" },
  };

  try {
    if (!debugMode) {
      await calendar.events.insert({
        auth: authToken,
        calendarId: `${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR}@group.calendar.google.com`,
        resource: event,
      });

      console.log("Inserted new item successfully: " + title);

      if (env === "prod") {
        const now = Date.now();
        processedItems.set(guid, now);
        await setProcessedItems(processedItems, town); // Save the processed item immediately
        console.log(`Added item ${guid} to processed items`);
      }

      return;
    } else {
      console.log("event", event);
    }
  } catch (error) {
    console.error("Error inserting item to calendar:", error);
    captureException(
      new Error(
        `Error inserting item to calendar for ${town}: ${error.message}`
      )
    );
    throw error;
  }

  return;
}

async function insertItemToCalendarWithRetry(
  item,
  town,
  regionLabel,
  townLabel,
  descriptionSelector,
  imageSelector,
  locationSelector,
  processedItems,
  authToken,
  removeImage
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
        processedItems,
        authToken,
        removeImage
      );
      return;
    } catch (error) {
      console.error("Error inserting item to calendar:", error);
      captureException(
        new Error(
          `Error inserting item to calendar for ${town} after ${retries} retries: ${error.message}`
        )
      );
      retries++;
      // Implement a delay before retrying (exponential backoff)
      await delay(Math.pow(2, retries) * 1000); // 2 seconds, 4 seconds, 8 seconds, etc.
    }
  }

  // If the maximum number of retries is reached, return null to indicate failure
  return null;
}

export default async function handler(req, res) {
  const startTime = Date.now();

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
      removeImage,
    } = towns.get(town);

    // Check if the rssFeed is available
    if (!rssFeed) {
      throw new Error("RSS feed URL not found for the town");
    }

    // Fetch the RSS feed
    const items = await fetchRSSFeed(rssFeed, town);

    // Read the database
    let processedItems = new Map();

    if (env === "prod") {
      processedItems = await getProcessedItems(town);
      await cleanProcessedItems(processedItems, town);
    }

    // Filter out already fetched items
    const newItems =
      env === "prod"
        ? items.filter((item) => !processedItems.has(item.guid))
        : items;

    // If no new items, log a message
    if (newItems.length === 0) {
      const message = `No new items found for ${town}`;
      console.log(message);
      res.status(200).json(message);
      return;
    }

    const authToken = await auth.getClient();
    let isTimeout = false;

    // Insert items in GCal
    for (const item of newItems) {
      // Check the elapsed time
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime > TIMEOUT_LIMIT - SAFETY_MARGIN) {
        console.log(
          "Approaching timeout limit, stopping processing of new items"
        );
        isTimeout = true;
        break; // Stop processing new items
      }

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
            processedItems,
            authToken,
            removeImage
          );
          return;
        } catch (error) {
          console.error("Error inserting item to calendar:", error);
        }
      });
    }

    if (!isTimeout) {
      console.log(`Finished processing items for ${town}`);
    } else {
      console.log(`Stopped processing items for ${town} due to timeout`);
    }

    // Send the response
    res.status(200).json(newItems);
  } catch (err) {
    console.error(err);
    captureException(err);
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
