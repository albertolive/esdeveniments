import { kv } from "@vercel/kv";
import { load } from "cheerio";
import Bottleneck from "bottleneck";
import { DateTime } from "luxon";
import { captureException } from "@sentry/nextjs";
import { CITIES_DATA } from "@utils/constants";
import { env } from "@utils/helpers";
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
const isCacheValid = (cachedData) =>
  cachedData && Date.now() - cachedData.timestamp < CONFIG.rssFeedCacheMaxAge;

// Fetches the RSS feed and returns the parsed data
async function fetchRSSFeed(rssFeed, town, shouldInteractWithKv) {
  try {
    if (shouldInteractWithKv) {
      const cachedData = await kv.get(
        `${env}_${town}_${CONFIG.rssFeedCacheKey}`
      );
      if (isCacheValid(cachedData)) {
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

    if (shouldInteractWithKv) {
      try {
        await kv.set(`${env}_${town}_${CONFIG.rssFeedCacheKey}`, {
          timestamp: Date.now(),
          data,
        });
      } catch (err) {
        logError(err, town, "caching RSS feed");
      }
    }

    console.log("Returning new RSS data");
    return data;
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
    edgeApiUrl.searchParams.append("itemUrl", sanitizedUrl);

    const response = await fetch(edgeApiUrl.toString());
    if (!response.ok) {
      throw new Error(`Edge API error! status: ${response.status}`);
    }

    return await response.text();
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
function getDescription($, item, region, town) {
  const {
    descriptionSelector,
    removeImage = false,
    getDescriptionFromRss = false,
  } = getTownData(region, town);
  const { itemDescription, content, url } = getRSSItemData(item);
  const alternativeDescription = `${itemDescription || ""}${content || ""}`;

  if (alternativeDescription && getDescriptionFromRss) {
    return alternativeDescription;
  }

  let description = $(descriptionSelector).html()?.trim();

  if (description) {
    let dom = $.parseHTML(description);
    let $desc = $(dom);

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

    description = $desc.toString();
  } else {
    description =
      "Encara no hi ha descripció. Afegeix-ne una i dóna vida a aquest espai!";
  }

  return description;
}

// Retrieves the image of an item
function getImage($, item, region, town, description) {
  const { imageSelector, removeImage = false } = getTownData(region, town);
  const { alternativeImage, url } = getRSSItemData(item);
  let rawImage = $(imageSelector).prop("outerHTML")?.trim();
  let image;
  const regex = /(https?:\/\/[^"\s]+)/g;

  if (alternativeImage) {
    image = alternativeImage;
  } else if (rawImage) {
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
  const { url } = getRSSItemData(item);
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
    const url = getRSSItemData(item).url;
    if (!url) {
      return null;
    }

    const { sanitizeUrl } = getTownData(region, town);
    const html = await fetchAndDecodeHtml(url, sanitizeUrl, town);
    if (!html) return null;

    const $ = load(html);
    const description = getDescription($, item, region, town);
    const image = getImage($, item, region, town, description);
    const video = getVideo(description);

    return formatDescription(item, description, image, video);
  } catch (error) {
    logError(error, town, "scraping description");
    return null;
  }
}

// Scrapes the location of an item
async function scrapeLocation(item, region, town) {
  try {
    const { locationSelector } = getTownData(region, town);
    const {
      url: itemUrl,
      location: itemLocation,
      locationExtra,
    } = getRSSItemData(item);
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
  } = item;

  if (!guid) {
    guid = createHash(title, url, location || locationExtra, date);
  }

  return {
    guid,
    pubDate,
    title,
    itemDescription,
    content,
    alternativeImage,
    url,
    location,
    locationExtra,
    date,
  };
}

// Creates an event from an RSS item
async function createEvent(item, region, town) {
  const { regionLabel, label: townLabel } = getTownData(region, town);
  const { pubDate, title, date } = getRSSItemData(item);
  const isDateObject = date && typeof date === "object";
  const hasFromDate = isDateObject && date.from;
  const hasToDate = isDateObject && date.to;
  const dateTimeParams = { zone: "Europe/Madrid" };

  let dateTime;

  if (pubDate) {
    dateTime = DateTime.fromRFC2822(pubDate, dateTimeParams);
  } else if (hasFromDate) {
    dateTime = DateTime.fromRFC2822(date.from, dateTimeParams);
  } else if (isDateObject) {
    console.log("Date object without from property:", date);
  } else {
    dateTime = DateTime.fromISO(ensureISOFormat(date), dateTimeParams);
  }

  if (!dateTime.isValid) {
    const errorMessage = `Invalid date format for event starting at ${
      pubDate || date.from || date
    }`;
    logError(new Error(errorMessage), town, "createEvent");
    return null;
  }

  const endDateTime = hasToDate
    ? DateTime.fromRFC2822(date.to, dateTimeParams)
    : dateTime.plus({ hours: 1 });

  if (!endDateTime.isValid) {
    const errorMessage = `Invalid date format for event ending at ${date.to}`;
    logError(new Error(errorMessage), town, "createEvent");
    return null;
  }

  const isFullDayEvent = dateTime.toFormat("HH:mm:ss") === "00:00:00";

  const description = await scrapeDescription(item, region, town);
  const scrapedLocation = await scrapeLocation(item, region, town);

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

  return event;
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

    const { rssFeed } = towns.get(town);
    if (!rssFeed) throw new Error("RSS feed URL not found for the town");

    console.log(`Fetching RSS feed for ${town}: ${rssFeed}`);
    const { items } = await fetchRSSFeed(rssFeed, town, shouldInteractWithKv);

    let processedItems = new Map();
    if (shouldInteractWithKv) {
      processedItems = await getProcessedItems(town);
      await cleanProcessedItems(processedItems, town);
    }

    const itemHashes = items.map(getRSSItemData).map((item) => item.guid);
    const processedItemsSet = new Set(processedItems.keys());
    const newItems = shouldInteractWithKv
      ? items.filter((_, i) => !processedItemsSet.has(itemHashes[i]))
      : items;

    if (newItems.length === 0) {
      const message = `No new items found for ${town}`;
      console.log(message);
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
    console.log(message);
    res
      .status(200)
      .json({ message, processedCount, totalItems: newItems.length });
  } catch (err) {
    logError(err, town || "Unknown", "handler");
    res.status(500).json({ error: `An error occurred: ${err.message}` });
  }
}
