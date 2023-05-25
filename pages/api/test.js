import { google } from "googleapis";
import cheerio from "cheerio";

const RssFeedEmitter = require("rss-feed-emitter");
const RSS_FEED_URL = "https://www.cardedeu.cat/rss/12/0/";
const calendarId =
  "d5c87644a31fb1296ac8ec2ff606e6b7845065255e98505ea94bb92ec3d35413@group.calendar.google.com";
const feedEmitter = new RssFeedEmitter();

const calendar = google.calendar("v3");
const auth = new google.auth.GoogleAuth({
  keyFile: "cultura-cardedeu-2be40f56af2a.json",
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

// Server-side cache to store inserted items
const insertedItemsCache = new Set();

feedEmitter.add({
  url: RSS_FEED_URL,
  refresh: 1000, // Fetch the feed every minute
  eventName: "ajuntament",
});

feedEmitter.on("ajuntament", handleFeedItem);

feedEmitter.on("error", handleFeedError);

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

async function handleFeedItem(item) {
  const itemTitle = item.title;
  console.log("Detecting new item", itemTitle);

  if (!insertedItemsCache.has((title) => title === itemTitle)) {
    try {
      await insertItemToCalendar(item);
    } catch (error) {
      console.error("Error inserting item to calendar:", error);
    }
  } else {
    console.log("Already fetched item: " + itemTitle);
  }
}

async function handleFeedError(error) {
  console.error("Error in RSS feed emitter:", error);
}

async function insertItemToCalendar(item) {
  if (!item) return;

  const { pubdate, title, link } = item || {};
  const dateTime = new Date(pubdate);
  const endDateTime = new Date(dateTime);
  endDateTime.setHours(endDateTime.getHours() + 1);
  const description = link ? await scrapeDescription(link) : null;

  const event = {
    summary: title,
    description,
    location: "",
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
    // const authToken = await auth.getClient();

    // await calendar.events.insert({
    //   auth: authToken,
    //   calendarId,
    //   resource: event,
    // });
    console.log("Inserted new item: " + title);
    insertedItemsCache.add(title);
  } catch (error) {
    console.error("Error inserting item to calendar:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  res.status(200).json({ message: "Success" });
}
