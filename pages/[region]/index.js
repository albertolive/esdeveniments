import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { monthsName, generateJsonData } from "@utils/helpers";
import { useGetEvents } from "@components/hooks/useGetEvents";
import {
  getTownLabel,
  getRegionLabel,
  addArticleToMonth,
  fixArticles,
} from "@utils/normalize";

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

const Events = dynamic(() => import("@components/ui/events"), {
  loading: () => "",
});

export default function App(props) {
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
  } = useGetEvents({ props, pageIndex: "all", maxResults: page * 10 });

  if (error) return <div>failed to load</div>;

  const jsonEvents = events
    .filter(({ isAd }) => !isAd)
    .map((event) => generateJsonData(event));

  const { town, byDate, region, currentYear } = props;
  const townLabel = getTownLabel(town);
  const regionLabel = getRegionLabel(region);
  const canonical = `${siteUrl}/${region}`;

  return (
    <Events
      events={events}
      jsonEvents={jsonEvents}
      metaTitle={`Agenda ${regionLabel} ${currentYear} - Què fer`}
      metaDescription={`Què fer és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a ${regionLabel}. L'agenda és col·laborativa.`}
      title={`Agenda ${regionLabel} ${currentYear}`}
      subTitle={`${fixArticles(`Les millors coses per fer ${regionLabel}: mercats, exposicions,
      descobriments, passejades, concerts, museus, teatre... Aquests són els
      millors plans per gaudir ${regionLabel} aquest ${
        monthsName[new Date().getMonth()]
      }!`)}`}
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
  const { REGIONS, TOWNS, BYDATES } = require("@utils/constants");

  const paths = REGIONS.reduce((acc, region) => {
    const townPaths = TOWNS.map((town) => {
      const datePaths = BYDATES.map((byDate) => ({
        params: {
          region: region.value,
          town: town.value,
          byDate: byDate.value,
        },
      }));
      return datePaths;
    });
    return [...acc, ...townPaths.flat()];
  }, []);

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { getCalendarEvents } = require("@lib/helpers");
  const { twoWeeksDefault } = require("@lib/dates");

  const { from, until } = twoWeeksDefault();

  const { events } = await getCalendarEvents({
    from,
    until,
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
