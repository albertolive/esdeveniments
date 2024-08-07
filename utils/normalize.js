import {
  slug,
  getFormattedDate,
  sanitizeText,
  getTownOptionsWithLabel,
  getRegionsLabel,
} from "./helpers";

const cloudinaryUrl = (imageId) =>
  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME}/image/upload/c_fill/c_scale,w_auto,q_auto,f_auto/v1/${process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET}/${imageId}`;

function to3HourForecastFormat(date) {
  const hours = date.getHours();
  let forecastHour = Math.ceil(hours / 3) * 3;

  if (forecastHour < 10) {
    forecastHour = "0" + forecastHour;
  }

  return `${forecastHour}:00:00`;
}

export const normalizeWeather = (startDate, weatherInfo) => {
  if (isNaN(startDate)) return {};
  const startDateConverted = startDate.toISOString().split("T")[0];
  const weatherArray =
    weatherInfo[`${startDateConverted} ${to3HourForecastFormat(startDate)}`];

  let weatherObject = {};

  if (weatherArray) {
    const { main, weather } = (weatherArray && weatherArray[0]) || {};

    weatherObject = {
      temp: Math.floor(main.temp),
      description:
        weather[0].description.charAt(0).toUpperCase() +
        weather[0].description.slice(1),
      icon: `/static/images/icons/${weather[0].icon}.png`,
    };
  }

  return weatherObject;
};

const extractEventImage = (description) => {
  if (!description) {
    return "";
  }

  const newFormatRegex = /<span class="hidden" data-image="([^"]+)">/;
  const newFormatMatch = description.match(newFormatRegex);
  if (newFormatMatch) {
    return newFormatMatch[1]; // Return the URL from the new format
  }

  const oldFormatRegexTraditional =
    /(http(s?):)([\\/|.|\w|\s|-])*\.(?!html|css|js)(?:jpg|jpeg|gif|png|JPG|PNG)/g;
  const oldFormatRegexCloudinary = /https?:\/\/res\.cloudinary\.com\/[^<]+/g;

  const hasTraditionalImage = description.match(oldFormatRegexTraditional);
  const hasCloudinaryImage = description.match(oldFormatRegexCloudinary);

  const imageUrl =
    (hasTraditionalImage && hasTraditionalImage[0]) ||
    (hasCloudinaryImage && hasCloudinaryImage[0]);

  return imageUrl;
};

const extractEventUrl = (description) => {
  if (!description) {
    return "";
  }

  const newFormatRegex =
    /<span id="more-info" class="hidden" data-url="([^"]+)">/;
  const newFormatMatch = description.match(newFormatRegex);
  if (newFormatMatch) {
    return newFormatMatch[1];
  }

  const oldFormatRegex =
    /<a class="text-primary" href="([^"]+)" target="_blank" rel="noopener noreferrer">/;
  const oldFormatMatch = description.match(oldFormatRegex);
  if (oldFormatMatch) {
    return oldFormatMatch[1];
  }

  return null;
};

const extractVideoURL = (description) => {
  if (!description) {
    return "";
  }

  const newFormatRegex = /<span class="hidden" data-video="([^"]+)">/;
  const newFormatMatch = description.match(newFormatRegex);
  if (newFormatMatch) {
    return newFormatMatch[1];
  }

  const iframeRegex = /<iframe[^>]+src="([^"]+)"[^>]*><\/iframe>/;

  const match = iframeRegex.exec(description);

  if (match) {
    return match[1];
  }

  return null;
};

const cleanDescription = (description) => {
  if (!description) {
    return null;
  }

  // Remove <span> elements with data attributes (including data-image)
  description = description.replace(
    /<span class="hidden" data-[^>]+><\/span>/g,
    ""
  );

  // Remove image links: <a> tags containing <img> tags
  // This regex looks for <a> tags that contain an <img> tag anywhere inside them
  const imageLinkRegex =
    /<a href="[^"]*"[\s\S]*?<img[\s\S]*?src="[^"]*"[\s\S]*?><\/a>/g;
  description = description.replace(imageLinkRegex, "");

  // Remove old format URL text
  // This regex is designed to match the specific structure of the old format
  const oldFormatURLTextRegex =
    /<br><br><b>Més informació:<\/b><br><a class="text-primary" href="[^"]*" target="_blank" rel="noopener noreferrer">[^<]*<\/a>/g;
  description = description.replace(oldFormatURLTextRegex, "");

  // Remove content inside <div class="first-image">...</div>
  const firstImageRegex = /<div class="first-image">(.*?)<\/div>/gs;
  description = description.replace(firstImageRegex, "");

  // Remove specific HTML structure 2
  const specificStructure2Regex = /<a href="[^"]*">[^<]*<\/a>/g;
  description = description.replace(specificStructure2Regex, "");

  // Remove all hyperlinks
  const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/g;
  description = description.replace(linkRegex, "$2");

  // Remove specific phrases like "Més informació a:" or "Més informació"
  // The regex uses \s* to match any amount of whitespace, and \:? to optionally match a colon
  const phrasesToRemoveRegex = /Més informació\s*a?:?\s*\.?/gi;
  description = description.replace(phrasesToRemoveRegex, "");

  // Remove <iframe> tags (videos)
  description = description.replace(
    /<iframe[^>]*src="[^"]*"[^>]*><\/iframe>/g,
    ""
  );

  return description.trim(); // Return the cleaned description
};

function timeUntilEvent(startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const now = new Date();

  if (now > endDate) {
    return "L'esdeveniment ha finalitzat.";
  }

  const calculatingForStart = now < startDate;
  const relevantDate = calculatingForStart ? startDate : endDate;

  const diffInMs = relevantDate - now;

  const diffInHours = diffInMs / (1000 * 60 * 60);

  const diffInDays = Math.round(diffInHours / 24);

  if (diffInHours < 24) {
    if (Math.round(diffInHours) === 1) {
      return calculatingForStart ? "Comença en 1 hora" : "Acaba en 1 hora";
    } else {
      return calculatingForStart
        ? `Comença en ${Math.round(diffInHours)} hores`
        : `Acaba en ${Math.round(diffInHours)} hores`;
    }
  } else if (diffInDays <= 30) {
    if (diffInDays === 1) {
      return calculatingForStart ? "Comença en 1 dia" : "Acaba en 1 dia";
    } else {
      return calculatingForStart
        ? `Comença en ${diffInDays} dies`
        : `Acaba en ${diffInDays} dies`;
    }
  } else {
    const diffInMonths = Math.round(diffInDays / 30);

    if (diffInMonths === 1) {
      return calculatingForStart ? "Comença en 1 mes" : "Acaba en 1 mes";
    } else {
      return calculatingForStart
        ? `Comença en ${diffInMonths} mesos`
        : `Acaba en ${diffInMonths} mesos`;
    }
  }
}

export function calculateDurationInHours(startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (startDate.toDateString() !== endDate.toDateString()) {
    return null;
  }

  const diffInMs = endDate - startDate;
  const diffInHours = diffInMs / (1000 * 60 * 60);

  if (diffInHours.toFixed(2) === "0.00") {
    return null;
  }

  if (diffInHours.toFixed(2) === "1.00") {
    return "1 hora";
  } else {
    return `${diffInHours.toFixed(2).replace(".", ",")} hores`;
  }
}

export const normalizeEvents = (event, weatherInfo) => {
  const startDate =
    (event.start && event.start.dateTime) || event.start.date || null;
  const endDate =
    (event.end && event.end.dateTime) || event.end.date || startDate || null;
  const isFullDayEvent =
    (event.start && event.start.date && !event.start.dateTime) || null;

  const {
    originalFormattedStart,
    formattedStart,
    formattedEnd,
    startTime,
    endTime,
    nameDay,
    isMultipleDays,
    duration,
    startDate: startDateStr,
  } = getFormattedDate(startDate, endDate);
  const weatherObject = normalizeWeather(startDateStr, weatherInfo);
  const eventImage = extractEventImage(event.description);
  const description = cleanDescription(event.description) || null;
  const locationParts = event.location ? event.location.split(",") : [];
  const town =
    locationParts.length > 1
      ? locationParts[locationParts.length - 2].trim()
      : "";
  const region =
    locationParts.length > 0
      ? locationParts[locationParts.length - 1].trim()
      : "";
  const location = locationParts.length > 2 ? locationParts[0].trim() : town;
  let title = event.summary ? sanitizeText(event.summary) : "";

  const tag = null; //CATEGORIES.find((v) => title.includes(v)) || null;

  const { coords = null, postalCode = null } = getTownOptionsWithLabel(town);

  if (tag) title = title.replace(`${tag}:`, "").trim();

  const imageUploaded = event.guestsCanModify || false;
  const imageId = event.id ? event.id.split("_")[0] : event.id;

  return {
    id: event.id,
    title,
    startTime,
    endTime,
    isFullDayEvent,
    location,
    subLocation: `${town}${town && region ? ", " : ""}${region}`,
    formattedStart,
    formattedEnd,
    nameDay,
    tag,
    slug: slug(title, originalFormattedStart, event.id),
    startDate,
    endDate,
    imageUploaded: imageUploaded ? cloudinaryUrl(imageId) : null,
    eventImage,
    description,
    weather: weatherObject,
    coords,
    isMultipleDays,
    postalCode,
    duration: duration || "PT1H",
  };
};

export const normalizeAroundEvents = (event) => {
  const startDate =
    (event.start && event.start.dateTime) || event.start.date || null;
  const endDate =
    (event.end && event.end.dateTime) || event.end.date || startDate || null;
  const isFullDayEvent =
    (event.start && event.start.date && !event.start.dateTime) || null;

  const {
    originalFormattedStart,
    formattedStart,
    formattedEnd,
    startTime,
    endTime,
    nameDay,
  } = getFormattedDate(startDate, endDate);
  const eventImage = extractEventImage(event.description);
  const locationParts = event.location ? event.location.split(",") : [];
  const town =
    locationParts.length > 1
      ? locationParts[locationParts.length - 2].trim()
      : "";
  const region =
    locationParts.length > 0
      ? locationParts[locationParts.length - 1].trim()
      : "";
  const location = locationParts.length > 2 ? locationParts[0].trim() : town;
  let title = event.summary ? sanitizeText(event.summary) : "";

  const imageUploaded = event.guestsCanModify || false;
  const imageId = event.id ? event.id.split("_")[0] : event.id;

  return {
    id: event.id,
    title,
    startTime,
    endTime,
    isFullDayEvent,
    location,
    subLocation: `${town}${town && region ? ", " : ""}${region}`,
    formattedStart,
    formattedEnd,
    nameDay,
    slug: slug(title, originalFormattedStart, event.id),
    startDate,
    endDate,
    imageUploaded: imageUploaded ? cloudinaryUrl(imageId) : null,
    eventImage,
  };
};

export const normalizeEvent = (event) => {
  if (!event || event.error) return null;

  const startDate =
    (event.start && event.start.dateTime) || event.start.date || null;
  const endDate =
    (event.end && event.end.dateTime) || event.end.date || startDate || null;
  const isFullDayEvent =
    (event.start && event.start.date && !event.start.dateTime) || null;

  const {
    originalFormattedStart,
    formattedStart,
    formattedEnd,
    startTime,
    endTime,
    nameDay,
    duration,
  } = getFormattedDate(event.start, event.end);

  let title = event.summary ? sanitizeText(event.summary) : "";
  const locationParts = event.location ? event.location.split(",") : [];
  const town =
    locationParts.length > 1
      ? locationParts[locationParts.length - 2].trim()
      : "";
  const region =
    locationParts.length > 0
      ? locationParts[locationParts.length - 1].trim()
      : "";
  const location = locationParts.length > 2 ? locationParts[0].trim() : town;
  const tag = null; //CATEGORIES.find((v) => title.includes(v)) || null;
  if (tag) title = title.replace(`${tag}:`, "").trim();
  const { postalCode = null, label = null } = getTownOptionsWithLabel(town);
  const imageUploaded = event.guestsCanModify || false;
  const imageId = event.id ? event.id.split("_")[0] : event.id;
  const eventImage = extractEventImage(event.description);
  const eventUrl = extractEventUrl(event.description);
  const mapsLocation = `${location}, ${town}${
    town && region ? ", " : ""
  }${region}, ${postalCode}`;
  const description = cleanDescription(event.description);
  const videoUrl = extractVideoURL(event.description);
  const timeUntil = timeUntilEvent(startDate, endDate);
  const durationInHours = calculateDurationInHours(startDate, endDate);

  return {
    id: event.id,
    title,
    startTime,
    endTime,
    isFullDayEvent,
    label,
    location,
    town,
    region,
    postalCode,
    mapsLocation,
    formattedStart,
    formattedEnd,
    nameDay,
    description: description || "",
    tag,
    slug: slug(title, originalFormattedStart, event.id),
    startDate,
    endDate,
    imageUploaded: imageUploaded ? cloudinaryUrl(imageId) : null,
    eventImage,
    imageId,
    isEventFinished: event.end
      ? new Date(event.end.dateTime) < new Date()
      : false,
    duration: duration || "PT1H",
    eventUrl,
    videoUrl,
    timeUntil,
    durationInHours,
  };
};

export const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const addArticleToMonth = (monthString) => {
  const vowels = ["a", "e", "i", "o", "u"];
  const firstLetter = monthString.charAt(0);

  if (vowels.includes(firstLetter)) {
    return `l'${monthString}`;
  } else {
    return `el ${monthString}`;
  }
};

export const fixArticles = (text) => {
  const placeNames = getRegionsLabel();
  let newText = text;

  placeNames.forEach((placeName) => {
    const regex = new RegExp(`\\b${placeName}\\b`, "gi");
    newText = newText.replace(regex, `al ${placeName}`);
  });
  return newText;
};
