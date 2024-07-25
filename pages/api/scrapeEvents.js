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

async function fetchHtmlContent(url, alternativeScrapper = false, isRSS = false) {
  let retries = RETRY_LIMIT;
  let delay = INITIAL_DELAY;

  const apiUrl = alternativeScrapper
    ? `/api/getAlternativeScrapper`
    : `/api/getDescription`;

  while (retries > 0) {
    try {
      let response;
      if (isRSS) {
        console.log(`Fetching RSS feed from: ${url}`);
        response = await fetch(url);
      } else {
        const fullUrl = new URL(
          `${apiUrl}?itemUrl=${encodeURIComponent(url)}`,
          siteUrl
        ).toString();
        console.log(`Fetching HTML content from: ${fullUrl}`);
        response = await fetch(fullUrl);
      }

      if (!response.ok) {
        throw new Error(`API error! status: ${response.status}`);
      }

      const content = await response.text();
      console.log(`Successfully fetched content. Length: ${content.length} characters`);
      return content;
    } catch (error) {
      retries--;
      console.error(
        `Error fetching content for ${url}, retries left: ${retries}`,
        error
      );
      if (retries === 0) {
        throw new Error(
          `Error fetching content for ${url}: ${error.message}`
        );
      }
      console.log(`Retrying in ${delay}ms...`);
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

async function extractEventDetails(content, selectors) {
  try {
    console.log('Parsing content...');
    const contentType = detectContentType(content);
    console.log('Detected content type:', contentType);

    const $ = cheerio.load(content, { xmlMode: contentType !== 'HTML' });
    const isHtml = contentType === 'HTML';

    let items = isHtml ? $(selectors.listSelector) : $('item');
    console.log(`Found ${items.length} items`);

    if (items.length === 0 && !isHtml) {
      for (const selector of ['entry', 'event']) {
        items = $(selector);
        if (items.length > 0) break;
      }
      console.log(`After trying alternative selectors, found ${items.length} items`);
    }

    const events = items.map((index, element) => {
      try {
        const title = $(element).find(isHtml ? selectors.titleSelector : 'title').text().trim();
        const url = isHtml ? $(element).find(selectors.urlSelector).attr('href') : $(element).find('link').text().trim();
        const description = $(element).find(isHtml ? selectors.descriptionSelector : 'description').text().trim();
        const dateText = $(element).find(isHtml ? selectors.dateSelector : 'pubDate').text().trim();
        const location = $(element).find(selectors.locationSelector).text().trim() || selectors.defaultLocation;
        const category = $(element).find('category').text().trim();

        if (!title || !url || !dateText) {
          console.warn(`Skipping item ${index + 1} due to missing required fields.`);
          return null;
        }

        const date = isHtml
          ? convertToRSSDate(dateText, '', selectors.dateRegex, selectors.timeRegex)
          : new Date(dateText);

        if (!date || isNaN(date.getTime())) {
          console.warn(`Invalid date format for item ${index + 1}: ${dateText}`);
          return null;
        }

        const rssDate = date.toUTCString();
        const hash = createHash(title + url + rssDate);
        const image = $(element).find(isHtml ? selectors.imageSelector : 'enclosure[type="image/jpeg"], media\\:content[medium="image"]').attr(isHtml ? 'src' : 'url') || '';

        return {
          id: hash,
          url: url.startsWith('http') ? url : `${selectors.domain}${url}`,
          title,
          location,
          date: rssDate,
          description,
          category,
          image,
        };
      } catch (itemError) {
        console.error(`Error processing item ${index + 1}:`, itemError.message);
        captureException(itemError);
        return null;
      }
    }).get().filter(Boolean);

    if (events.length === 0) {
      console.warn('No valid events were extracted from the content.');
      captureException(new Error('No valid events extracted'));
    } else {
      console.log(`Successfully extracted ${events.length} events from ${selectors.defaultLocation}`);
    }

    return events;
  } catch (error) {
    console.error('Error in extractEventDetails:', error.message);
    captureException(error);
    throw error;
  }
}

async function createEventRss(city) {
  console.log('Creating RSS feed for city:', city);
  const cityData = CITIES_SELECTORS[city];

  if (!cityData) {
    const error = `Invalid city: ${city}`;
    console.error(error);
    captureException(new Error(error));
    return null;
  }

  try {
    console.log(`Fetching content for ${city} from ${cityData.url}`);
    const content = await fetchHtmlContent(
      cityData.url,
      cityData.alternativeScrapper,
      cityData.isRSS
    );
    console.log(`Content fetched for ${city}, length: ${content.length}`);

    const contentType = detectContentType(content);
    console.log(`Detected content type: ${contentType}`);

    const events = await extractEventDetails(content, cityData);

    if (!events || events.length === 0) {
      console.warn(`No events extracted for ${city}`);
      return null;
    }

    console.log(`Extracted ${events.length} events for ${city}`);
    console.log('Creating RSS feed for events:', events);
    return createRssFeed(events, city);
  } catch (error) {
    console.error(`Error creating RSS feed for ${city}:`, error);
    console.error('Error stack:', error.stack);
    captureException(error);
    return null;
  }
}

function detectContentType(content) {
  const trimmedContent = content.trim().toLowerCase();
  if (trimmedContent.startsWith('<?xml') ||
      trimmedContent.startsWith('<rss') ||
      trimmedContent.includes('<rss') ||
      trimmedContent.includes('<feed') ||
      trimmedContent.includes('<atom')) {
    return 'RSS';
  } else if (trimmedContent.startsWith('<')) {
    return 'XML';
  } else if (trimmedContent.startsWith('{') || trimmedContent.startsWith('[')) {
    return 'JSON';
  } else {
    return 'HTML';
  }
}

export default async function handler(req, res) {
  const { city } = req.query;
  console.log('Handler function called with city:', city);

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
        const selector = CITIES_SELECTORS[singleCity];
        console.log('Selector for city:', selector);

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
    console.error('Error in handler function:', error);
    console.error('Error stack:', error.stack);
    captureException(error);
    res.status(500).json({
      error: `Failed to create RSS feed for ${city}`,
      details: error.message,
    });
  }
}
