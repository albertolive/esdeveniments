const formatDate = (date) =>
  new Date(date).toISOString().replace(/-|:|\.\d+/g, "");

const encodeParams = (params) =>
  Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

const createUrl = (base, params) => `${base}?${encodeParams(params)}`;

export const generateCalendarUrls = ({
  title,
  description,
  location,
  startDate,
  endDate,
  canonical,
}) => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  const htmlDescription = `${description.trim()}<br><br>Més informació: <a href="${canonical}" target="_blank" rel="noopener noreferrer">Esdeveniments.cat</a>`;
  const plainDescription = `${description.trim()}\n\nMés informació: ${canonical}`;

  const googleParams = {
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details: htmlDescription,
    location,
  };

  const outlookParams = {
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: title,
    startdt: start,
    enddt: end,
    body: plainDescription,
    location,
  };

  const iCalParams = {
    BEGIN: "VCALENDAR",
    VERSION: "2.0",
    BEGIN_2: "VEVENT",
    DTSTART: start,
    DTEND: end,
    SUMMARY: title,
    DESCRIPTION: plainDescription,
    LOCATION: location,
    END: "VEVENT",
    END_2: "VCALENDAR",
  };

  return {
    google: createUrl("https://www.google.com/calendar/render", googleParams),
    outlook: createUrl("https://outlook.live.com/owa/", outlookParams),
    ical: `data:text/calendar;charset=utf8,${encodeParams(iCalParams).replace(
      /&/g,
      "%0D%0A"
    )}`,
  };
};
