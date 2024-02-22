// import { CATEGORIES } from "./constants";
const crypto = require("crypto");
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

const hasEventImage = (description) => {
  const regexTraditional =
    /(http(s?):)([\\/|.|\w|\s|-])*\.(?!html|css|js)(?:jpg|jpeg|gif|png|JPG|PNG)/g;
  const regexCloudinary = /https?:\/\/res\.cloudinary\.com\/[^<]+/g;

  const hasTraditionalImage =
    description && description.match(regexTraditional);
  const hasCloudinaryImage = description && description.match(regexCloudinary);

  const imageUrl =
    (hasTraditionalImage && hasTraditionalImage[0]) ||
    (hasCloudinaryImage && hasCloudinaryImage[0]);

  return imageUrl;
};

export const normalizeEvents = (event, weatherInfo) => {
  const {
    originalFormattedStart,
    formattedStart,
    formattedEnd,
    startTime,
    endTime,
    isFullDayEvent,
    nameDay,
    startDate,
    isMultipleDays,
  } = getFormattedDate(event.start, event.end);
  const weatherObject = normalizeWeather(startDate, weatherInfo);
  const eventImage = hasEventImage(event.description);
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

  const { coords, postalCode } = getTownOptionsWithLabel(town);

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
    startDate:
      (event.start && event.start.dateTime) || event.start.date || null,
    endDate:
      (event.end && event.end.dateTime) ||
      (event.start.end && event.start.end) ||
      event.start.date,
    imageUploaded: imageUploaded
      ? cloudinaryUrl(imageId)
      : eventImage
      ? eventImage
      : null,
    description: event.description
      ? event.description
      : "Cap descripció. Vols afegir-ne una? Escriu-nos i et direm com fer-ho!",
    weather: weatherObject,
    coords,
    isMultipleDays,
    postalCode,
  };
};

export const normalizeEvent = (event) => {
  if (!event || event.error) return null;

  const {
    originalFormattedStart,
    formattedStart,
    formattedEnd,
    startTime,
    endTime,
    nameDay,
    isFullDayEvent,
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
  const eventImage = hasEventImage(event.description);
  const mapsLocation = `${location}, ${town}${
    town && region ? ", " : ""
  }${region}, ${postalCode}`;

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
    description: event.description
      ? event.description
      : "Cap descripció. Vols afegir-ne una? Escriu-nos i et direm com fer-ho!",
    tag,
    slug: slug(title, originalFormattedStart, event.id),
    startDate:
      (event.start && event.start.dateTime) || event.start.date || null,
    endDate:
      (event.end && event.end.dateTime) ||
      (event.start.end && event.start.end) ||
      event.start.date,
    imageUploaded: imageUploaded
      ? cloudinaryUrl(imageId)
      : eventImage
      ? eventImage
      : null,
    eventImage,
    imageId,
    isEventFinished: event.end
      ? new Date(event.end.dateTime) < new Date()
      : false,
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

export function createHash(title, url, location, date) {
  const hash = crypto
    .createHash("md5")
    .update(title + url + location + date)
    .digest("hex");

  return hash;
}
