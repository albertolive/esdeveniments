import { memo } from "react";
import Image from "next/image";

const CalendarList = ({ getUrls, title }) => {
  const urls = getUrls();

  const calendarOptions = [
    {
      name: "Google Calendar",
      url: urls.google,
      icon: "google-calendar.png",
    },
    {
      name: "Outlook",
      url: urls.outlook,
      icon: "outlook.jpeg",
    },
    {
      name: "iCal",
      url: urls.ical,
      icon: "ical.png",
      download: `${title}.ics`,
    },
  ];

  return (
    <div className="absolute top-full left-0 mt-2 z-10 bg-whiteCorp">
      <div className="shadow-md rounded-md p-4 border border-bColor animate-appear ">
        {calendarOptions.map((option) => (
          <a
            key={option.name}
            href={option.url}
            target="_blank"
            rel="noopener noreferrer"
            download={option.download}
            className="block mb-6 last:mb-0 hover:underline"
          >
            <button className={`btn flex items-center justify-center`}>
              <Image
                src={`/static/images/icons/${option.icon}`}
                alt={`${option.name} icon`}
                width={20}
                height={20}
                className="mr-2"
              />
              <span>{option.name}</span>
            </button>
          </a>
        ))}
      </div>
    </div>
  );
};

export default memo(CalendarList);
