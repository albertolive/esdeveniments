const axios = require("axios");
const { DateTime } = require("luxon");
const crypto = require("crypto");

const API_URL =
  "https://api.browse.ai/v2/robots/fe4f7bf3-e349-4949-a1f5-ef3ccaa65bb6/tasks";
const AUTH_TOKEN =
  "Bearer 30f32826-c140-480e-be00-572887bdbb0a:1205aef5-5326-43ac-94e8-599e54a5968a";
const DATE_FORMAT = "dd/MM/yyyy";
const TIME_ZONE = "Europe/Madrid";

async function fetchData() {
  const options = {
    method: "get",
    url: API_URL,
    params: { page: "1", sort: "-finishedAt" },
    headers: {
      Authorization: AUTH_TOKEN,
    },
  };

  try {
    const response = await axios(options);
    return response.data.result.robotTasks.items[0].capturedLists[
      "Agenda barcelona"
    ];
  } catch (error) {
    console.error(`Error fetching data from ${API_URL}:`, error);
    throw error;
  }
}

function convertDateToRSS(date) {
  let rssDate;

  if (date.includes("Des de")) {
    // For date range
    const dates = date.match(/\d{2}\/\d{2}\/\d{4}/g);
    const dtStart = DateTime.fromFormat(dates[0], DATE_FORMAT, {
      zone: TIME_ZONE,
    });
    const dtEnd = DateTime.fromFormat(dates[1], DATE_FORMAT, {
      zone: TIME_ZONE,
    });
    const rssDateStart = dtStart.toRFC2822();
    const rssDateEnd = dtEnd.toRFC2822();
    rssDate = {
      from: rssDateStart,
      to: rssDateEnd,
    };
  } else {
    // For single date
    const dt = DateTime.fromFormat(date, DATE_FORMAT, { zone: TIME_ZONE });
    rssDate = {
      from: dt.toRFC2822(),
      to: null,
    };
  }

  return rssDate;
}

function normalizeData(events) {
  return events
    .map(({ title, description, url, location, date, imageUrl }) => {
      if (!title) return null;

      const formattedDate = convertDateToRSS(date);
      const hash = crypto
        .createHash("md5")
        .update(`${title}${url}${location}${date}`)
        .digest("hex");

      return {
        guid: hash,
        title,
        description,
        link: url,
        date: formattedDate,
        imageUrl,
        location,
      };
    })
    .filter(Boolean);
}

async function scrapeEvents() {
  try {
    const events = await fetchData();
    return normalizeData(events);
  } catch (error) {
    console.error("Error in scrapeEvents function:", error);
    throw new Error("Failed to scrape events");
  }
}

export default async function handler(_, res) {
  try {
    const rssXml = await scrapeEvents();
    res.status(200).send(rssXml);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to handle request: ${error.message}` });
  }
}
