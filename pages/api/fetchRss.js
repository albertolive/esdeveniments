import { kv } from "@vercel/kv";
import { load } from "cheerio";
import Bottleneck from "bottleneck";
import { DateTime } from "luxon";
import { captureException } from "@sentry/nextjs";
import { CITIES_DATA } from "@utils/constants";
import { env, sanitizeUrl } from "@utils/helpers";
import { getAuthToken } from "@lib/auth";
import { postToGoogleCalendar } from "@lib/apiHelpers";
import createHash from "@utils/createHash";
import { siteUrl } from "@config/index";

// Configuration
const CONFIG = {
  debugMode: false,
  timeoutLimit: env === "prod" ? process.env.NEXT_PUBLIC_TIMEOUT_LIMIT : 100000,
  safetyMargin: 1000,
  processedItemsKey: "processedItems",
  rssFeedCacheKey: "rssFeedCache",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  rssFeedCacheMaxAge: 3 * 60 * 60 * 1000, // 3 hours
};

const limiter = new Bottleneck({ maxConcurrent: 5, minTime: 300 });

// Utility function to log errors
function logError(error, town, context) {
  const errorMessage = `Error in ${context} for town ${town || "Unknown"}: ${
    error.message
  }`;
  console.error(errorMessage);
  captureException(new Error(errorMessage), {
    tags: { town: town || "Unknown", context },
    extra: { originalError: error },
  });
}

// Utility function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Utility function to check cache validity
const isCacheValid = (cachedData, cachedTime) =>
  cachedData && Date.now() - cachedData.timestamp < cachedTime;

// Fetches the RSS feed and returns the parsed data
async function fetchRSSFeed(
  rssFeed,
  town,
  shouldInteractWithKv,
  increaseCacheTime
) {
  try {
    if (shouldInteractWithKv) {
      const cachedData = await kv.get(
        `${env}_${town}_${CONFIG.rssFeedCacheKey}`
      );
      const cachedTime = increaseCacheTime
        ? 24 * 60 * 60 * 1000
        : CONFIG.rssFeedCacheMaxAge;
      if (isCacheValid(cachedData, cachedTime)) {
        console.log(`Returning cached data for ${town}`);
        return cachedData.data;
      }
    }

    const edgeApiUrl = new URL("/api/getRss", siteUrl);
    edgeApiUrl.searchParams.append("rssFeed", rssFeed);

    const response = await fetch(edgeApiUrl.toString());

    if (!response.ok) {
      throw new Error(
        `Error fetching rss feed edge. status: ${response.status}`
      );
    }

    const data = await response.json();

    if (!data || !data.items || !Array.isArray(data.items)) {
      throw new Error(
        `Invalid data structure received for ${town}. Expected {items: Array}, got: ${JSON.stringify(
          data
        )}`
      );
    }

    const { items } = data;

    if (shouldInteractWithKv) {
      try {
        await kv.set(`${env}_${town}_${CONFIG.rssFeedCacheKey}`, {
          timestamp: Date.now(),
          data: items,
        });
      } catch (err) {
        logError(err, town, "caching RSS feed");
      }
    }

    console.log(`Returning ${items.length} items for ${town}`);
    return items;
  } catch (err) {
    logError(err, town, "fetching RSS feed");
    return [];
  }
}

// Fetches processed items from the KV store
async function getProcessedItems(town) {
  try {
    const processedItems = await kv.get(
      `${env}_${town}_${CONFIG.processedItemsKey}`
    );
    return processedItems ? new Map(processedItems) : new Map();
  } catch (err) {
    logError(err, town, "getting processed items");
    return new Map();
  }
}

// Sets processed items in the KV store
async function setProcessedItems(processedItems, town) {
  try {
    console.log(`Setting processed items for ${town}`);
    await kv.set(`${env}_${town}_${CONFIG.processedItemsKey}`, [
      ...processedItems,
    ]);
  } catch (err) {
    logError(err, town, "setting processed items");
  }
}

// Removes expired items from processed items
async function removeExpiredItems(processedItems) {
  const now = Date.now();
  let removedItemsCount = 0;
  for (const [item, timestamp] of processedItems) {
    if (now - timestamp > CONFIG.maxAge) {
      processedItems.delete(item);
      removedItemsCount++;
    }
  }
  console.log(
    `Removed ${removedItemsCount} expired items from processed items`
  );
}

// Cleans processed items by removing expired ones and updating the KV store
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

// Utility functions for handling images and URLs
const getEventImageUrl = (description) => {
  const regex = /(http(s?):)([\\/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|JPG)/g;
  const match = description && description.match(regex);
  return match && match[0];
};

function replaceImageUrl(imageUrl, baseUrl) {
  if (imageUrl) {
    imageUrl = imageUrl.replace(/src="\/media/g, `src="${baseUrl}/media`);
    imageUrl = imageUrl.replace(/href="\/media/g, `href="${baseUrl}/media`);
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

// Fetches and decodes HTML content
async function fetchAndDecodeHtml(url, sanitizeUrl = true, town = "Unknown") {
  try {
    const sanitizedUrl = sanitizeUrl ? sanitize(url) : url;
    const edgeApiUrl = new URL("/api/getDescription", siteUrl);
    edgeApiUrl.searchParams.append("itemUrl", encodeURIComponent(sanitizedUrl));

    const response = await fetch(edgeApiUrl.toString());

    if (!response.ok) {
      throw new Error(`Edge API error! status: ${response.status}`);
    }

    const html = await response.text();

    return html;
  } catch (error) {
    logError(error, town, "fetching and decoding HTML");
    return null;
  }
}

// Sanitizes URLs by removing the ".html" extension
function sanitize(url) {
  return url.replace(/\.html$/, "");
}

// Retrieves the description of an item
async function getDescription(item, region, town) {
  const { fullDescription, url: originalUrl } = item;
  const {
    descriptionSelector,
    removeImage = false,
    getDescriptionFromRss = false,
  } = getTownData(region, town);

  // If we have a description from RSS and we're allowed to use it, return it
  if (fullDescription && getDescriptionFromRss) {
    return fullDescription;
  }

  // Sanitize the URL
  const url = sanitizeUrl(originalUrl);

  if (!url) {
    console.warn(`Invalid URL for item in ${town}:`, originalUrl);
    return "";
  }

  // If we don't have a description from RSS or we're not allowed to use it, scrape the website
  try {
    const { sanitizeUrl: shouldSanitizeUrl } = getTownData(region, town);
    const html = await fetchAndDecodeHtml(url, shouldSanitizeUrl, town);

    if (!html) return "";

    const $ = load(html);
    let $desc = $(descriptionSelector);

    if ($desc.length) {
      // Handle images
      $desc.find("img").each((_, img) => {
        let src = $(img).attr("src");
        if (src && !src.startsWith("http")) {
          src = new URL(src, getBaseUrl(url)).href;
          $(img).attr("src", src);
        }
      });

      if (removeImage) {
        $desc.find("img").remove();
      }

      // Extract text content
      let description = $desc.text().trim();

      // Remove extra whitespace and newlines
      description = description.replace(/\s+/g, " ").trim();

      // Limit description length if needed
      const maxLength = 500; // Adjust this value as needed
      if (description.length > maxLength) {
        description = description.substring(0, maxLength) + "...";
      }

      return description;
    } else {
      return "";
    }
  } catch (error) {
    logError(error, town, "scraping description");
    return fullDescription || "";
  }
}

// Retrieves the image of an item
async function getImage(item, region, town, description) {
  const { imageSelector, removeImage = false } = getTownData(region, town);
  const { alternativeImage, url } = item;

  if (alternativeImage) {
    return alternativeImage;
  }

  // If we need to scrape the image
  try {
    const { sanitizeUrl } = getTownData(region, town);
    const html = await fetchAndDecodeHtml(url, sanitizeUrl, town);
    if (!html) return null;

    const $ = load(html);
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

      let src = $img("img").attr("src");
      if (!src.startsWith("http")) {
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

    return image;
  } catch (error) {
    logError(error, town, "getting image");
    return null;
  }
}

// Retrieves the video URL from the description
const getVideo = (description) => {
  const iframeRegex = /<iframe[^>]+src="([^"]+)"[^>]*><\/iframe>/;
  const match = iframeRegex.exec(description);
  if (match) {
    return match[1];
  }
  return null;
};

// Formats the event description with HTML
function formatDescription(item, description, image, video) {
  const { url } = item;
  return `
    <div>${description}</div>
    ${image ? `<span class="hidden" data-image="${image}"></span>` : ""}
    ${video ? `<span class="hidden" data-video="${video}"></span>` : ""}
    <span id="more-info" class="hidden" data-url="${url}"></span>
  `;
}

// Scrapes the description of an item
async function scrapeDescription(item, region, town) {
  try {
    const { url, title } = item;
    if (!url) {
      return title;
    }

    const description = await getDescription(item, region, town);
    const image = await getImage(item, region, town, description);
    const video = getVideo(description);

    const finalDescription = description || title;

    return formatDescription(item, finalDescription, image, video);
  } catch (error) {
    logError(error, town, "scraping description");
    return item.title;
  }
}

// Scrapes the location of an item
async function scrapeLocation(item, region, town) {
  try {
    const { locationSelector } = getTownData(region, town);
    const { url: itemUrl, location: itemLocation, locationExtra } = item;
    const location = itemLocation || locationExtra;
    if (location) return location;

    const html = await fetchAndDecodeHtml(itemUrl, true, town);
    if (!html) return null;

    const $ = load(html);

    let locationElement = $(locationSelector).find("p").first().text();

    if (Array.isArray(locationElement)) {
      locationElement = locationElement.map((item) => {
        if (item.length > 100) {
          return item.split(",")[0];
        }
        return item;
      })[0];
    }

    if (locationElement && locationElement.length > 100) {
      locationElement = locationElement.split(",")[0];
    }

    return locationElement ? locationElement.trim() : location;
  } catch (error) {
    logError(error, town, "scraping location");
    return null;
  }
}

// Ensures date strings are in ISO format
function ensureISOFormat(dateString) {
  const isoFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/;
  if (typeof dateString !== "string") {
    dateString = String(dateString);
  }
  if (!isoFormat.test(dateString)) {
    dateString = dateString.replace(" ", "T");
  }
  return dateString;
}

// Retrieves data from an RSS item
function getRSSItemData(item) {
  if (!item) {
    throw new Error("No item provided");
  }
  let {
    guid,
    pubDate,
    title,
    description: itemDescription,
    content,
    image: alternativeImage,
    link: url,
    location = "",
    "content:encoded": locationExtra,
    date,
    "events:dates": eventsDates,
  } = item;

  if (!guid) {
    guid = createHash(title, url, location || locationExtra, date);
  }

  // Combine itemDescription and content for a more comprehensive description
  const fullDescription = itemDescription || content || "";

  return {
    guid,
    pubDate,
    title,
    fullDescription,
    alternativeImage,
    url,
    location,
    locationExtra,
    date,
    eventsDates,
  };
}

// Creates an event from an RSS item
async function createEvent(item, region, town) {
  const { regionLabel, label: townLabel } = getTownData(region, town);
  const { pubDate, title, date, eventsDates } = item;
  const dateTimeParams = { zone: "Europe/Madrid" };

  let dateTime, endDateTime;

  function parseDateTime(dateString, timeString = "00:00:00") {
    return DateTime.fromISO(`${dateString}T${timeString}`, dateTimeParams);
  }

  function handleInvalidDate(errorMessage) {
    logError(new Error(errorMessage), town, "createEvent");
    return null;
  }

  if (eventsDates && eventsDates["events:date"]) {
    const {
      "events:date_start": dateStart,
      "events:time_start": timeStart = "00:00:00",
      "events:date_end": dateEnd,
      "events:time_end": timeEnd = "23:59:59",
    } = eventsDates["events:date"];

    dateTime = parseDateTime(dateStart, timeStart);

    if (dateStart === dateEnd && timeStart === timeEnd) {
      endDateTime = dateTime.plus({ hours: 1 });
    } else {
      endDateTime = parseDateTime(dateEnd, timeEnd);
    }

    if (!dateTime.isValid || !endDateTime.isValid) {
      return handleInvalidDate(
        `Invalid date format for event with start date ${dateStart} and end date ${dateEnd}`
      );
    }
  } else {
    const isDateObject = date && typeof date === "object";
    const hasFromDate = isDateObject && date.from;
    const hasToDate = isDateObject && date.to;

    if (pubDate) {
      dateTime = DateTime.fromRFC2822(pubDate, dateTimeParams);
    } else if (hasFromDate) {
      dateTime = DateTime.fromRFC2822(date.from, dateTimeParams);
    } else if (isDateObject) {
      console.warn("Date object without from property:", date);
      return null;
    } else {
      dateTime = DateTime.fromISO(ensureISOFormat(date), dateTimeParams);
    }

    if (!dateTime.isValid) {
      return handleInvalidDate(
        `Invalid date format for event starting at ${
          pubDate || date.from || date
        }`
      );
    }

    endDateTime = hasToDate
      ? DateTime.fromRFC2822(date.to, dateTimeParams)
      : dateTime.plus({ hours: 1 });

    if (!endDateTime.isValid) {
      return handleInvalidDate(
        `Invalid date format for event ending at ${date.to}`
      );
    }
  }

  const isFullDayEvent =
    dateTime.startOf("day").equals(dateTime) &&
    endDateTime.endOf("day").equals(endDateTime);

  // Fetch description and location in parallel
  const [description, scrapedLocation] = await Promise.all([
    scrapeDescription(item, region, town),
    scrapeLocation(item, region, town),
  ]);

  return {
    summary: title,
    description,
    location: scrapedLocation
      ? `${scrapedLocation}, ${townLabel}, ${regionLabel}`
      : `${townLabel}, ${regionLabel}`,
    start: isFullDayEvent
      ? { date: dateTime.toFormat("yyyy-MM-dd") }
      : { dateTime: dateTime.toJSDate(), timeZone: "Europe/Madrid" },
    end: isFullDayEvent
      ? { date: endDateTime.plus({ days: 1 }).toFormat("yyyy-MM-dd") }
      : { dateTime: endDateTime.toJSDate(), timeZone: "Europe/Madrid" },
  };
}

// Inserts an event into Google Calendar
async function insertEventToCalendar(
  event,
  town,
  item,
  processedItems,
  token,
  shouldInteractWithKv
) {
  try {
    if (!CONFIG.debugMode) {
      await postToGoogleCalendar(event, token);
      console.log("Inserted new item successfully: " + event.summary);

      if (shouldInteractWithKv) {
        const { guid } = getRSSItemData(item);
        const now = Date.now();
        processedItems.set(guid, now);
        await setProcessedItems(processedItems, town);
        console.log(`Added item ${guid} to processed items`);
      }
    } else {
      console.log("event", event);
    }
  } catch (error) {
    logError(error, town, "insertEventToCalendar");
  }
}

// Inserts an item into the calendar
async function insertItemToCalendar(
  item,
  region,
  town,
  processedItems,
  token,
  shouldInteractWithKv
) {
  try {
    const event = await createEvent(item, region, town);
    if (event) {
      await insertEventToCalendar(
        event,
        town,
        item,
        processedItems,
        token,
        shouldInteractWithKv
      );
    }
  } catch (error) {
    logError(error, town, "insertItemToCalendar");
  }
}

// Inserts an item into the calendar with retries
async function insertItemToCalendarWithRetry(
  item,
  region,
  town,
  processedItems,
  token,
  shouldInteractWithKv
) {
  if (!item) return;

  const MAX_RETRIES = 3;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await insertItemToCalendar(
        item,
        region,
        town,
        processedItems,
        token,
        shouldInteractWithKv
      );
      return;
    } catch (error) {
      console.error(
        `Error inserting item to calendar on attempt ${retries + 1}:`,
        error
      );
      logError(
        error,
        town,
        `insertItemToCalendarWithRetry attempt ${retries + 1}`
      );
      retries++;
      await delay(Math.pow(2, retries) * 1000);
    }
  }
}

// Retrieves town data from the constants
function getTownData(region, town) {
  const { label: regionLabel, towns } = CITIES_DATA.get(region);
  const townData = towns.get(town);
  return { regionLabel, ...townData };
}

const processItems = async (
  items,
  region,
  town,
  processedItems,
  token,
  shouldInteractWithKv
) => {
  return Promise.all(
    items.map(async (item) => {
      try {
        return limiter.schedule(() =>
          insertItemToCalendarWithRetry(
            item,
            region,
            town,
            processedItems,
            token,
            shouldInteractWithKv
          )
        );
      } catch (error) {
        logError(error, town, `processing item ${item.guid}`);
        return false;
      }
    })
  );
};

// Main handler function for the API
export default async function handler(req, res) {
  const { region, town, disableKvInsert } = req.query;
  const shouldInteractWithKv = !(env !== "prod" && disableKvInsert === "true");

  try {
    if (!region) throw new Error("Region parameter is missing");
    if (!town) throw new Error("Town parameter is missing");
    if (!CITIES_DATA.has(region)) throw new Error("Region not found");

    const { towns } = CITIES_DATA.get(region);
    if (!towns.has(town)) throw new Error("Town not found");

    const {
      rssFeed,
      disableInsertion = false,
      increaseCacheTime = false,
    } = towns.get(town);

    if (disableInsertion) {
      const message = `Event insertion is disabled for ${town}. Skipping processing.`;
      console.log(message);
      res.status(200).json({ message, processedCount: 0, totalItems: 0 });
      return;
    }

    if (!rssFeed) throw new Error("RSS feed URL not found for the town");

    console.log(`Fetching RSS feed for ${town}: ${rssFeed}`);
    let items = await fetchRSSFeed(
      rssFeed,
      town,
      shouldInteractWithKv,
      increaseCacheTime
    );

    // Ensure items is an array without full normalization
    if (!Array.isArray(items)) {
      console.warn(`Items for ${town} is not an array. Attempting to correct.`);
      items = Array.isArray(items.items) ? items.items : [items];
    }

    // Log the structure in production for debugging
    if (env === "prod") {
      console.log(
        "Items structure:",
        JSON.stringify(items.slice(0, 2), null, 2)
      ); // Log only first two items
    }

    let processedItems = new Map();
    if (shouldInteractWithKv) {
      processedItems = await getProcessedItems(town);
      await cleanProcessedItems(processedItems, town);
    }

    // Use getRSSItemData to process items
    const processedRSSItems = items.map(getRSSItemData);
    const itemHashes = processedRSSItems.map((item) => item.guid);
    const processedItemsSet = new Set(processedItems.keys());
    const newItems = shouldInteractWithKv
      ? processedRSSItems.filter(
          (_, i) => !processedItemsSet.has(itemHashes[i])
        )
      : processedRSSItems;

    if (newItems.length === 0) {
      const message = `No new items found for ${town}`;
      res.status(200).json({ message });
      return;
    }

    const token = await getAuthToken();
    const results = await processItems(
      newItems,
      region,
      town,
      processedItems,
      token,
      shouldInteractWithKv
    );
    const processedCount = results.filter(Boolean).length;

    const message = `Finished processing ${processedCount} items for ${town}`;

    res
      .status(200)
      .json({ message, processedCount, totalItems: newItems.length });
  } catch (err) {
    logError(err, town || "Unknown", "handler");
    res.status(500).json({ error: `An error occurred: ${err.message}` });
  }
}
