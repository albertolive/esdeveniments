import { DAYS, MONTHS, LOCATIONS, VITAMINED_LOCATIONS } from "./constants";

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

const isLessThanFiveDays = (date) => {
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - date.getTime();
  const dayDiff = timeDiff / (1000 * 3600 * 24);
  return Math.floor(Math.abs(dayDiff)) < 5;
};

export const sanitize = (url) => {
  const accents = [
    /[\u0300-\u030f]/g, // Combining Diacritical Marks
    /[\u1AB0-\u1AFF]/g, // Combining Diacritical Marks Extended
    /[\u1DC0-\u1DFF]/g, // Combining Diacritical Marks Supplement
    /[\u1F00-\u1FFF]/g, // Greek Extended
    /[\u2C80-\u2CFF]/g, // Coptic
    /[\uFB00-\uFB06]/g, // Alphabetic Presentation Forms (ligatures)
  ];

  let sanitizedUrl = url.toLowerCase();

  sanitizedUrl = sanitizedUrl.replace(/\s+$/, "");

  // Remove accents
  accents.forEach((regex) => {
    sanitizedUrl = sanitizedUrl.normalize("NFD").replace(regex, "");
  });

  // Replace spaces and illegal characters with hyphens
  sanitizedUrl = sanitizedUrl.replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-");

  // Replace consecutive hyphens, en-dashes, and em-dashes with a single hyphen
  sanitizedUrl = sanitizedUrl.replace(/[-\s]+/g, "-");

  return sanitizedUrl;
};

export const sanitizeText = (str) =>
  str.replace("&amp;", "&").replace(/\[Ad\]/g, "");

export const slug = (str, formattedStart, id) =>
  `${sanitize(str)}-${formattedStart
    .toLowerCase()
    .replace(/ /g, "-")
    .replace("---", "-")
    .replace("ç", "c")
    .replace(/--/g, "-")}-${id}`;

export const convertTZ = (date, tzString) =>
  new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );

export const getFormattedDate = (start, end) => {
  const startDate = new Date(
    (start && start.date) || (start && start.dateTime) || start
  );
  const endDate = new Date((end && end.date) || (end && end.dateTime) || end);
  const startDateConverted = convertTZ(startDate, "Europe/Madrid");
  const endDateConverted = convertTZ(endDate, "Europe/Madrid");

  let isMultipleDays = false;
  let isSameMonth = false;
  let isSameYear = false;
  const startDay = startDateConverted.getDate();
  const endDay = endDateConverted.getDate();

  if (startDay !== endDay) isMultipleDays = true;

  if (startDateConverted.getMonth() === endDateConverted.getMonth())
    isSameMonth = true;

  if (startDateConverted.getFullYear() === endDateConverted.getFullYear())
    isSameYear = true;

  const weekDay = new Date(startDateConverted).getDay();
  const month = new Date(startDateConverted).getMonth();
  const year = new Date(startDateConverted).getFullYear();
  const nameDay = DAYS[weekDay];
  const nameMonth = MONTHS[month];

  const originalFormattedStart = `${startDay} de ${nameMonth} del ${year}`;
  const formattedStart =
    isMultipleDays && isSameMonth
      ? `${startDay}`
      : `${startDay} de ${nameMonth} ${
          isMultipleDays && isSameYear ? "" : `del ${year}`
        }`;
  const formattedEnd = `${endDay} de ${
    MONTHS[endDateConverted.getMonth()]
  } del ${endDateConverted.getFullYear()}`;
  const startTime = `${startDateConverted.getHours()}:${String(
    startDateConverted.getMinutes()
  ).padStart(2, "0")}`;
  const endTime = `${endDateConverted.getHours()}:${String(
    endDateConverted.getMinutes()
  ).padStart(2, "0")}`;

  return {
    originalFormattedStart,
    formattedStart,
    formattedEnd: isMultipleDays ? formattedEnd : null,
    startTime,
    endTime,
    nameDay,
    startDate: isMultipleDays
      ? (startDay <= new Date().getDate() &&
          convertTZ(new Date(), "Europe/Madrid")) ||
        startDateConverted
      : startDateConverted,
    isLessThanFiveDays: isLessThanFiveDays(startDate),
  };
};

export const getVitaminedLocation = (location) => {
  let locationNormalized = VITAMINED_LOCATIONS["cardedeu"];

  Object.keys(LOCATIONS).find((k) => {
    if (
      location
        .toLowerCase()
        .split(" ")
        .some((word) => LOCATIONS[k].includes(word))
    )
      locationNormalized = VITAMINED_LOCATIONS[k];
  });

  return locationNormalized;
};

export const nextDay = (x) => {
  let now = new Date();
  now.setDate(now.getDate() + ((x + (7 - now.getDay())) % 7));
  const covertDate = convertTZ(now, "Europe/Madrid");

  return covertDate;
};

export const isWeekend = () => {
  const now = new Date();

  return now.getDay() === 0 || now.getDay() === 5 || now.getDay() === 6;
};

export const monthsName = [
  "gener",
  "febrer",
  "març",
  "abril",
  "maig",
  "juny",
  "juliol",
  "agost",
  "setembre",
  "octubre",
  "novembre",
  "desembre",
];

const transformImagestoAbsoluteUrl = (images) =>
  images.map((image) => `${siteUrl}${image}`);

export const generateJsonData = ({
  title,
  slug,
  description,
  startDate,
  endDate,
  location,
  lat,
  lng,
  imageUploaded,
  images,
  isMoney,
  eventImage,
}) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: title,
  url: `${siteUrl}/${slug}`,
  startDate,
  endDate,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: location,
    address: {
      "@type": "PostalAddress",
      streetAddress: location,
      addressLocality: isMoney ? "Barcelona" : "Cardedeu",
      postalCode: isMoney ? "" : "08440",
      addressCountry: "ES",
      addressRegion: "CT",
    },
    geo: {
      latitude: lat,
      "@type": "GeoCoordinates",
      longitude: lng,
    },
  },
  image: [
    imageUploaded,
    eventImage,
    ...transformImagestoAbsoluteUrl(images),
  ].filter(Boolean),
  description,
  performer: {
    "@type": "PerformingGroup",
    name: location,
  },
  organizer: {
    "@type": "Organization",
    name: location,
    url: siteUrl,
  },
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: `${siteUrl}/${slug}`,
    validFrom: startDate,
  },
  isAccessibleForFree: true,
});

export function createArrayOfObjects(arr) {
  return arr.map(function (item) {
    return { value: item, label: item.charAt(0).toUpperCase() + item.slice(1) };
  });
}
