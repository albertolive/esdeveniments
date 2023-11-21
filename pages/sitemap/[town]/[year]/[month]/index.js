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
    .filter(({ isAd }) => !isAd)
    .map((event) => generateJsonData(event));

  return <>
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
    <div className="reset-this mb-2">
      <h1>
        <span className="capitalize">{month}</span> del {year}
      </h1>
    </div>
    {events.map((event) => (
      <div key={event.id} className="py-1 w-fit">
        <Link href={`/${event.slug}`} prefetch={false} className="hover:underline">

          <p className="text-sm" key={event.id}>
            {event.formattedEnd
              ? `${event.title} - Del ${event.formattedStart} al ${event.formattedEnd}`
              : `${event.title} - ${event.formattedStart}`}
          </p>

        </Link>
      </div>
    ))}
  </>;
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

  years.map((year) => {
    MONTHS_URL.map((month) => {
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
    });
  });

  return {
    paths: params,
    fallback: false,
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
      events: normalizedEvents.filter(({ isAd }) => !isAd),
      town: townLabel,
    },
  };
}
