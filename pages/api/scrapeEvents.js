const cheerio = require("cheerio");
const RSS = require("rss");
const { DateTime } = require("luxon");
import { siteUrl } from "@config/index";
import { captureException } from "@sentry/nextjs";
import createHash from "@utils/createHash";
import { CITIES_SELECTORS } from "@utils/cities";

const monthMap = {
  gener: "01",
  febrer: "02",
  març: "03",
  abril: "04",
  maig: "05",
  juny: "06",
  juliol: "07",
  agost: "08",
  setembre: "09",
  octubre: "10",
  novembre: "11",
  desembre: "12",
};

const CONCURRENCY_LIMIT = 5;
const RETRY_LIMIT = 5;
const INITIAL_DELAY = 1000;

function convertToRSSDate(dateString, timeString, dateRegex, timeRegex) {
  const match = dateString.match(dateRegex.regex);
  const timeMatch = timeString ? timeString.match(timeRegex) : null;

  if (!match) {
    console.error(`Invalid date format: ${dateString}`);
    captureException(new Error(`Invalid date format: ${dateString}`));
    return null;
  }

  const day = dateRegex.swapDayMonthOrder
    ? parseInt(match[2], 10)
    : parseInt(match[1], 10);
  const month = dateRegex.swapDayMonthOrder ? match[1] : match[2];
  const year = !isNaN(match[3])
    ? parseInt(match[3], 10)
    : new Date().getFullYear();
  const hour = !isNaN(match[4])
    ? parseInt(match[4], 10)
    : timeMatch
    ? timeMatch[1]
    : 0;
  const minute = !isNaN(match[5])
    ? parseInt(match[5], 10)
    : timeMatch
    ? timeMatch[2]
    : 0;

  const monthNumber = !isNaN(month)
    ? +month
    : monthMap[
        Object.keys(monthMap).find((key) => key.includes(month.toLowerCase()))
      ];

  if (!monthNumber) {
    const error = `Invalid month value: ${month}`;
    console.error(error);
    captureException(new Error(error));
    return null;
  }

  return DateTime.fromObject(
    { day, month: parseInt(monthNumber), year, hour, minute },
    { zone: "Europe/Madrid" }
  );
}

async function fetchHtmlContent(url, alternativeScrapper = false) {
  let retries = RETRY_LIMIT;
  let delay = INITIAL_DELAY;

  const apiUrl = alternativeScrapper
    ? `/api/getDescription`
    : `/api/getDescription`;

  while (retries > 0) {
    try {
      const response = await fetch(
        new URL(
          `${apiUrl}?itemUrl=${encodeURIComponent(url)}`,
          siteUrl
        ).toString()
      );

      if (!response.ok) {
        throw new Error(`Edge API error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      retries--;
      console.error(
        `Error fetching HTML content for ${url}, retries left: ${retries}`,
        error
      );
      if (retries === 0) {
        throw new Error(
          `Error fetching HTML content for ${url}: ${error.message}`
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}

async function exhaustiveSearch(url, selectors, initialData = {}) {
  const {
    locationSelector,
    dateSelector,
    dateAttr,
    timeSelector,
    descriptionSelector,
    imageSelector,
    alternativeScrapper,
  } = selectors;
  const html = await fetchHtmlContent(url, alternativeScrapper);
  const $ = cheerio.load(html);

  const data = {
    date:
      initialData.date ||
      (dateAttr
        ? $(dateSelector).attr(dateAttr).trim()
        : $(dateSelector).text().trim()),
    time: initialData.time || $(timeSelector).text().trim(),
    location: initialData.location || $(locationSelector).text().trim(),
    description:
      initialData.description || $(descriptionSelector).text().trim(),
    image: initialData.image || $(imageSelector).attr("src"),
  };

  return data;
}

async function extractEventDetails(html, selectors) {
  const $ = cheerio.load(html);
  const events = [];

  const items = $(selectors.listSelector).toArray();
  const concurrencyLimit = CONCURRENCY_LIMIT; // Limit the number of concurrent requests
  let index = 0;

  const processBatch = async () => {
    while (index < items.length) {
      const batch = items.slice(index, index + concurrencyLimit);
      index += concurrencyLimit;

      await Promise.allSettled(
        batch.map(async (element) => {
          try {
            const title = $(element)
              .find(selectors.titleSelector)
              .text()
              .trim();
            const url = $(element).find(selectors.urlSelector).attr("href");
            const rssUrl =
              url && url.includes(selectors.domain)
                ? url
                : `${selectors.domain}${url}`;

            let date = selectors.dateAttr
              ? $(element)
                  .find(selectors.dateSelector)
                  .attr(selectors.dateAttr)
                  .trim()
              : $(element).find(selectors.dateSelector).text().trim();
            let time = $(element).find(selectors.timeSelector).text().trim();
            let location = $(element)
              .find(selectors.locationSelector)
              .text()
              .trim();
            let description = $(element)
              .find(selectors.descriptionSelector)
              .text()
              .trim();
            let image = $(element).find(selectors.imageSelector).attr("src");

            if (!date || !time || !location || !description || !image) {
              ({ date, time, location, description, image } =
                await exhaustiveSearch(rssUrl, selectors, {
                  date,
                  time,
                  location,
                  description,
                  image,
                }));
            }

            if (!location) location = selectors.defaultLocation;
            if (!description) description = title;

            const hash = createHash(title, url, location, date);
            const rssDate =
              date &&
              convertToRSSDate(
                date,
                time,
                selectors.dateRegex,
                selectors.timeRegex
              );
            const rssImage = image
              ? image.includes(selectors.domain)
                ? image.replace(selectors.urlImage, "/")
                : `${selectors.domain}${image.replace(selectors.urlImage, "/")}`
              : image;

            description += rssImage
              ? ` <div class="hidden">${rssImage}</div>`
              : "";
            events.push({
              id: hash,
              url: rssUrl,
              title,
              location,
              date: rssDate,
              description,
              image: rssImage,
            });

            // Add a delay between processing each event to avoid hitting rate limits
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (error) {
            console.error(`Error processing event: ${error.message}`);
          }
        })
      );
    }
  };

  await processBatch();

  console.log(
    `Number of scraped events: ${events.length} from ${selectors.defaultLocation}`
  );
  return events;
}

function createRssFeed(events, city) {
  const feed = new RSS({
    title: `Esdeveniments a ${city}`,
    description: `Esdeveniments a ${city}`,
    feed_url: `${siteUrl}/api/scrapeEvents?city=${city}`,
    site_url: siteUrl,
    generator: "Esdeveniments.cat",
  });

  events.forEach((event) => {
    if (!event.title) return;
    feed.item({
      guid: event.id,
      title: event.title,
      description: event.description,
      url: event.url,
      date: event.date,
      enclosure: { url: event.image },
      custom_elements: [{ location: event.location }],
    });
  });

  return feed.xml({ indent: true });
}

async function createEventRss(city) {
  const cityData = CITIES_SELECTORS[city];

  if (!cityData) {
    const error = `Invalid city: ${city}`;
    console.error(error);
    captureException(new Error(error));
    return null;
  }

  try {
    const html = await fetchHtmlContent(
      cityData.url,
      cityData.alternativeScrapper
    );
    const events = await extractEventDetails(html, cityData);
    return createRssFeed(events, city);
  } catch (error) {
    console.error(`Error creating RSS feed for ${city}:`, error);
    captureException(error);
    return null;
  }
}

export default async function handler(req, res) {
  const { city } = req.query;
  console.log(`Processing request for city: ${city}`);

  if (!city) {
    res.status(400).json({ error: "City parameter is missing" });
    return;
  }

  try {
    const cities = city.split(",");
    const results = {};
    console.log(`Processing cities: ${cities}`);
    for (const singleCity of cities) {
      try {
        const rssXml = await createEventRss(singleCity);
        results[singleCity] = rssXml || null;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(
          `Error processing city ${singleCity}:`,
          error.message,
          error.stack
        );
        captureException(error);
        results[singleCity] = null;
      }
    }

    const successfulCities = Object.keys(results).filter(
      (c) => results[c] !== null
    );

    if (successfulCities.length > 0) {
      if (successfulCities.length === 1) {
        res.status(200).send(results[successfulCities[0]]);
      } else {
        res.status(200).json(results);
      }
    } else {
      res.status(500).json({ error: `Failed to create RSS feed for ${city}` });
    }
  } catch (error) {
    console.error(`Error in scrapeEvents handler for ${city}:`, error);
    captureException(error);
    res.status(500).json({
      error: `Failed to create RSS feed for ${city}`,
      details: error.message,
    });
  }
}
