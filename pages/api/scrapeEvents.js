const axios = require("axios");
const cheerio = require("cheerio");
const RSS = require("rss");
const { format } = require("date-fns");
const { es } = require("date-fns/locale");
const { utcToZonedTime } = require("date-fns-tz");

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;
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
  "la-roca": {
    domain: "http://www.laroca.cat",
    url: "http://www.laroca.cat/agenda",
    listSelector: ".agenda_item",
    titleSelector: ".titol",
    urlSelector: ".info_cos a",
    dateSelector: ".agenda_data.agenda_data_absolut",
    descriptionSelector: ".titol",
    imageSelector: ".imatge-principal",
    locationSelector: ".item_info > i.fa.fa-map-marker + *",
    dateRegex:
      /^(\d{1,2}) ([A-Z][a-z]{2}|[a-z]{3}) (\d{4}) - (\d{2}):(\d{2})h$/i,
  },
};

const monthMap = {
  gen: "Jan",
  feb: "Feb",
  març: "Mar",
  abr: "Apr",
  maig: "May",
  juny: "Jun",
  jul: "Jul",
  ag: "Aug",
  ago: "Aug",
  set: "Sep",
  oct: "Oct",
  nov: "Nov",
  des: "Dec",
};

async function fetchHtmlContent(url) {
  const response = await axios.get(url);
  return response.data;
}

function convertToRSSDate(dateString, dateRegex) {
  const match = dateString.match(dateRegex);

  if (match) {
    const day = parseInt(match[1], 10);
    const month = match[2];
    const year = parseInt(match[3], 10);
    const hour = parseInt(match[4], 10);
    const minute = parseInt(match[5], 10);
    const monthEnglish = monthMap[month.toLowerCase()];

    const date = new Date(
      `${day} ${monthEnglish} ${year} ${hour}:${minute}:00 GMT`
    );
    const madridDate = utcToZonedTime(date, "Europe/Madrid");
    const formattedDate = format(madridDate, "EEE, dd MMM yyyy HH:mm:ss xx", {
      timeZone: "Europe/Madrid",
    });

    return formattedDate;
  }
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

  $(listSelector).each((index, element) => {
    const id = index;
    const title = $(element).find(titleSelector).text().trim();
    const url = $(element).find(urlSelector).attr("href");

    // Extract the date information from the HTML
    let date;
    if (selectors === CITIES.granollers) {
      date = $(element).find(dateSelector).text().trim();
      date = convertToRSSDate(date, dateRegex);
    } else if (selectors === CITIES["la-roca"]) {
      const dayOfMonth = $(element)
        .find(".data_dia_mes_interior > span.data_gris")
        .text()
        .trim();

      const month = $(element).find(".data_mes .data_gris").text().trim();

      // Extract the start time information from the HTML
      const startTimeString = $(element)
        .find(".fa-clock-o")
        .parent()
        .text()
        .trim();

      let startHour = "09";
      let startMinute = "00";
      if (startTimeString) {
        const startTimeMatch = startTimeString.match(/(\d{2}):(\d{2})/);
        if (startTimeMatch) {
          startHour = startTimeMatch[1];
          startMinute = startTimeMatch[2];
        }
      }

      // Construct a correctly formatted date string

      const currentYear = new Date().getFullYear();
      date = `${dayOfMonth} ${month.toLowerCase()} ${currentYear} - ${startHour}:${startMinute}h`;
      // Convert the date string into a valid RSS pubDate using the convertToRSSDate function
      date = convertToRSSDate(date, dateRegex);
    }

    const location = $(element).find(locationSelector).text().trim();
    const description = $(element).find(descriptionSelector).text();
    const image = $(element).find(imageSelector).attr("src");

    const rssUrl = `${selectors.domain}${url}`;
    const rssImage =
      (image && selectors.urlImage && image.replace(selectors.urlImage, "/")) ||
      `${selectors.domain}${image}`;

    events.push({
      id,
      url: rssUrl,
      title,
      location,
      date,
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
    res.status(500).json({ error: "Failed to create RSS feed" });
  }
}
