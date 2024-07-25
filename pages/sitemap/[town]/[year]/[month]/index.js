import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Script from "next/script";
import { generateJsonData, getTownLabel, getRegionByTown, generateRegionsOptions, generateTownsOptions } from "@utils/helpers";
import Meta from "@components/partials/seo-meta";
import Link from "next/link";
import { MONTHS_URL } from "@utils/constants";
import { siteUrl } from "@config/index";
import { getCalendarEvents } from "@lib/helpers";
import { getHistoricDates, getAllYears } from "@lib/dates";
import { getCacheClient } from "@lib/cache";

const NoEventsFound = dynamic(
  () => import("@components/ui/common/noEventsFound"),
  {
    loading: () => "",
    ssr: false,
  }
);

export default function Month({ events, town, townLabel }) {
  const { query } = useRouter();
  const { year, month: rawMonth } = query;
  const month = rawMonth === "marc" ? rawMonth.replace("c", "ç") : rawMonth;

  const jsonData = events
    ? events.filter(({ isAd }) => !isAd).map((event) => generateJsonData(event))
    : [];

  const renderEventItem = (event) => (
    <div key={event.id}>
      <Link
        href={`/e/${event.slug}`}
        prefetch={false}
        className="hover:text-primary"
      >
        <h3>{event.title}</h3>
        <p className="text-sm">
          {event.formattedEnd
            ? `${event.formattedStart} - ${event.formattedEnd}`
            : event.formattedStart}
        </p>
      </Link>
    </div>
  );

  return (
    <>
      <Script
        id={`${town}-${month}-${year}-script`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonData) }}
      />
      <Meta
        title={`Arxiu de ${townLabel} del ${month} del ${year} - Esdeveniments.cat`}
        description={`Descobreix què va passar a ${townLabel} el ${month} del ${year}. Teatre, cinema, música, art i altres excuses per no parar de descobrir ${townLabel} - Arxiu - Esdeveniments.cat`}
        canonical={`${siteUrl}/sitemap/${town}/${year}/${month}`}
      />
      <div className="flex flex-col justify-center items-center gap-2 p-6">
        <h1 className="font-semibold italic uppercase">
          Arxiu {townLabel} - {month} del {year}
        </h1>
        <div className="flex flex-col items-start">
          {events && events.length ? events.map(renderEventItem) : <NoEventsFound />}
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const regions = generateRegionsOptions();
  const years = getAllYears();
  const params = [];

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const nextThreeMonths = currentMonth + 2;

  const generateParams = (year, month, region, town) => ({
    params: {
      town,
      year: year.toString(),
      month: month.toLowerCase(),
    },
  });

  years.forEach((year) => {
    if (year === currentYear) {
      MONTHS_URL.forEach((month, index) => {
        if (index >= currentMonth && index <= nextThreeMonths) {
          regions.forEach((region) => {
            const towns = generateTownsOptions(region.value);
            towns.forEach((town) => {
              params.push(generateParams(year, month, region.value, town.value));
            });
          });
        }
      });
    }
  });

  return {
    paths: params,
    fallback: true, // Generate remaining pages on-demand
  };
}

export async function getStaticProps({ params }) {
  try {
    const { town, year, month } = params;
    const cacheKey = `sitemap-${town}-${year}-${month}`;
    const cache = getCacheClient();

    // Check if data is in cache
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

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
    const filteredEvents = normalizedEvents?.filter(({ isAd }) => !isAd) || [];

    const props = {
      props: {
        events: filteredEvents,
        town,
        townLabel,
      },
      revalidate: 3600, // Revalidate every hour
    };

    // Cache the result
    await cache.set(cacheKey, JSON.stringify(props), 'EX', 3600);

    return props;
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true };
  }
}
