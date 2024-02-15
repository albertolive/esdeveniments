const axios = require("axios");
const cheerio = require("cheerio");
const RSS = require("rss");
const { DateTime } = require("luxon");
import { siteUrl } from "@config/index";
import { createHash } from "@utils/normalize";

const CITIES = {
  granollers: {
    domain: "https://www.granollers.cat",
    url: "https://www.granollers.cat/agenda",
    listSelector: ".item-list > ul > li",
    titleSelector: "h3 a",
    urlSelector: "h3 a",
    dateSelector: ".date-info .date-day",
    descriptionSelector: "div > h3",
    imageSelector: ".responsive-image",
    locationSelector: "h4",
    urlImage: "/styles/home_agenda/public/",
    dateRegex: /^(\d{1,2}) ([a-z]+)\. (\d{4}) - (\d{2}):(\d{2})h$/i,
  },
};

function convertToRSSDate(dateString, dateRegex) {
  const monthMap = {
    gen: "01",
    febr: "02",
    març: "03",
    abr: "04",
    maig: "05",
    juny: "06",
    jul: "07",
    ag: "08",
    set: "09",
    oct: "10",
    nov: "11",
    des: "12",
  };

  const match = dateString.match(dateRegex);

  if (match) {
    const day = parseInt(match[1], 10);
    const month = match[2];
    const year = parseInt(match[3], 10);
    const hour = parseInt(match[4], 10);
    const minute = parseInt(match[5], 10);

    const monthNumber = monthMap[month.toLowerCase()];

    if (!monthNumber) {
      console.error(`Invalid month value: ${month}`);
      return null;
    }

    const date = DateTime.fromObject(
      {
        day: day,
        month: parseInt(monthNumber),
        year: year,
        hour: hour,
        minute: minute,
      },
      {
        zone: "Europe/Madrid",
      }
    );

    return date;
  }

  return null;
}

async function fetchHtmlContent(url) {
  const response = await axios.get(url);
  return response.data;
}

function extractEventDetails(html, selectors) {
  const {
    listSelector,
    titleSelector,
    urlSelector,
    locationSelector,
    dateSelector,
    descriptionSelector,
    imageSelector,
    dateRegex,
  } = selectors;
  const $ = cheerio.load(html);
  const events = [];

  $(listSelector).each((_, element) => {
    const title = $(element).find(titleSelector).text().trim();
    const url = $(element).find(urlSelector).attr("href");
    const date = $(element).find(dateSelector).text().trim();
    const location = $(element).find(locationSelector).text().trim();
    const description = $(element).find(descriptionSelector).text();
    const image = $(element).find(imageSelector).attr("src");
    const rssDate = date && convertToRSSDate(date, dateRegex);
    const rssUrl = `${selectors.domain}${url}`;
    const rssImage = image && image.replace(selectors.urlImage, "/");
    const hash = createHash(title, url, location, date);

    events.push({
      id: hash,
      url: rssUrl,
      title,
      location,
      date: rssDate,
      description,
      image: rssImage,
    });
  });

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
  const cityData = CITIES[city];

  if (!cityData) {
    throw new Error("Invalid city");
  }

  try {
    const html = await fetchHtmlContent(cityData.url);
    const events = extractEventDetails(html, cityData);
    const rssXml = createRssFeed(events, city);
    return rssXml;
  } catch (error) {
    console.error("Error creating RSS feed:", error);
    throw new Error("Failed to create RSS feed");
  }
}

export default async function handler(req, res) {
  const { city } = req.query;

  if (!city) {
    res.status(400).json({ error: "City parameter is missing" });
    return;
  }

  try {
    const rssXml = await createEventRss(city);
    res.status(200).send(rssXml);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create RSS feed", details: error });
  }
}
