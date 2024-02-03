import { useRouter } from "next/router";
import Script from "next/script";
import { generateJsonData } from "@utils/helpers";
import Meta from "@components/partials/seo-meta";
import Link from "next/link";
import { MONTHS_URL } from "@utils/constants";
import { siteUrl } from "@config/index";

export default function Month({ events, town }) {
  const { query } = useRouter();
  let { year, month } = query;

  if (month === "marc") month = month.replace("c", "ç");

  const jsonData = events
    ? events.filter(({ isAd }) => !isAd).map((event) => generateJsonData(event))
    : [];

  return (
    <>
      <Script
        id="-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonData) }}
      />
      <Meta
        title={`Arxiu del ${month} del ${year} - Esdeveniments.cat`}
        description={`Descobreix què va passar a ${town} el ${month} del ${year}. Teatre, cinema, música, art i altres excuses per no parar de descobrir ${town} - Arxiu - Esdeveniments.cat`}
        canonical={`${siteUrl}/sitemap/${year}/${month}`}
      />
      <div className="flex flex-col justify-center items-start gap-2 p-6">
        <h1 className="font-semibold italic uppercase">
          {month} del {year}
        </h1>
        {events.map((event) => (
          <div key={event.id} className="">
            <Link
              href={`/e/${event.slug}`}
              prefetch={false}
              className="hover:text-primary"
            >
              <h3 key={event.id}>{event.title}</h3>
              <p className="text-sm" key={event.id}>
                {event.formattedEnd
                  ? `${event.formattedStart} - ${event.formattedEnd}`
                  : `${event.formattedStart}`}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const { getAllYears } = require("@lib/dates");
  const {
    generateRegionsOptions,
    generateTownsOptions,
  } = require("@utils/helpers");

  const regions = generateRegionsOptions();
  const years = getAllYears();
  let params = [];

  // Get the current year and the next three months
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const nextThreeMonths = currentMonth + 3;

  years.map((year) => {
    MONTHS_URL.map((month, index) => {
      // Only pre-render pages for the current year and the next three months
      if (
        year < currentYear ||
        (year === currentYear && index <= nextThreeMonths)
      ) {
        regions.map((region) => {
          const towns = generateTownsOptions(region.value);
          towns.map((town) => {
            params.push({
              params: {
                town: town.value,
                year: year.toString(),
                month: month.toLowerCase(),
              },
            });
          });
        });
      }
    });
  });

  return {
    paths: params,
    fallback: true, // Generate remaining pages on-demand
  };
}

export async function getStaticProps({ params }) {
  const { getCalendarEvents } = require("@lib/helpers");
  const { getHistoricDates } = require("@lib/dates");
  const { getTownLabel, getRegionByTown } = require("@utils/helpers");

  const { town, year, month } = params;
  const { from, until } = getHistoricDates(month, year);
  const townLabel = getTownLabel(town);

  const { events } = await getCalendarEvents({
    from,
    until,
    maxResults: 2500,
    filterByDate: false,
    q: `${townLabel || ""} ${getRegionByTown(town) || ""}`,
  });

  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return {
    props: {
      events: normalizedEvents && normalizedEvents.filter(({ isAd }) => !isAd),
      town: townLabel,
    },
  };
}
