import { useState } from "react";
import dynamic from "next/dynamic";
import { monthsName, generateJsonData } from "@utils/helpers";
import { useGetEvents } from "@components/hooks/useGetEvents";
import { getTownLabel, getRegionLabel, fixArticles } from "@utils/normalize";

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

const Events = dynamic(() => import("@components/ui/events"), {
  loading: () => "",
});

export default function App(props) {
  const { town, byDate, region, currentYear } = props;
  const [page, setPage] = useState(() => {
    const storedPage =
      typeof window !== "undefined" &&
      window.localStorage.getItem("currentPage");
    return storedPage ? parseInt(storedPage) : 1;
  });
  const {
    data: { events = [] },
    error,
    isLoading,
    isValidating,
  } = useGetEvents({
    props,
    pageIndex: "all",
    q: getRegionLabel(region) || "",
    maxResults: page * 10,
  });

  if (error) return <div>failed to load</div>;

  const jsonEvents = events
    .filter(({ isAd }) => !isAd)
    .map((event) => generateJsonData(event));

  const townLabel = getTownLabel(town);
  const regionLabel = getRegionLabel(region);
  const canonical = `${siteUrl}/${region}`;

  return (
    <Events
      events={events}
      jsonEvents={jsonEvents}
      metaTitle={`Agenda ${regionLabel} ${currentYear} - Esdeveniments.cat`}
      metaDescription={`Esdeveniments.cat és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a ${regionLabel}. L'agenda és col·laborativa.`}
      title={`Agenda ${regionLabel} ${currentYear}`}
      subTitle={`${fixArticles(`Les millors coses per fer ${regionLabel}: mercats, exposicions,
      descobriments, passejades, concerts, museus, teatre... Aquests són els
      millors plans per gaudir aquest ${monthsName[new Date().getMonth()]}!`)}`}
      description={`${fixArticles(`Voleu viure experiències úniques i emocionants? La cultura ${regionLabel} és el lloc on cal estar! Us oferim una gran varietat d'opcions perquè mai us avorriu i sempre tingueu
      alguna cosa interessant per fer. Descobriu tot el que passa ${regionLabel} i voltants, i deixeu-vos sorprendre per la seva riquesa cultural.`)}`}
      noEventsFound={false}
      byDate={byDate}
      townLabel={townLabel}
      canonical={canonical}
      isLoading={isLoading}
      isValidating={isValidating}
      loadMore
      page={page}
      setPage={setPage}
    />
  );
}

export async function getStaticPaths() {
  const { CITIES_DATA, BYDATES } = require("@utils/constants");

  const paths = [];

  for (const [regionKey, region] of CITIES_DATA) {
    for (const [townKey, town] of region.towns) {
      const datePaths = BYDATES.map((byDate) => ({
        params: {
          region: regionKey,
          town: townKey,
          byDate: byDate.value,
        },
      }));
      paths.push(...datePaths);
    }
  }

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { getCalendarEvents } = require("@lib/helpers");
  const { twoWeeksDefault } = require("@lib/dates");
  const { from, until } = twoWeeksDefault();
  const { region } = params;
  const { events } = await getCalendarEvents({
    from,
    until,
    q: getRegionLabel(region) || "",
  });
  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return {
    props: {
      events: normalizedEvents,
      currentYear: new Date().getFullYear(),
      ...params,
    },

    revalidate: 60,
  };
}
