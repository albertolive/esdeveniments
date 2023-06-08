import { useState } from "react";
import { useGetEvents } from "@components/hooks/useGetEvents";
import { monthsName, generateJsonData } from "@utils/helpers";
import Events from "@components/ui/events";

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

export default function App(props) {
  const [page, setPage] = useState(() => {
    const storedPage =
      typeof window !== "undefined" &&
      window.localStorage.getItem("currentPage");
    return storedPage ? parseInt(storedPage) : 1;
  });
  const {
    data: { events = [], currentYear },
    error,
    isLoading,
    isValidating,
  } = useGetEvents({ props, pageIndex: "all", maxResults: page * 10 });

  const canonical = `${siteUrl}`;
  const month = monthsName[new Date().getMonth()];

  if (error) return <div>failed to load</div>;

  const jsonEvents = events
    .filter(({ isAd }) => !isAd)
    .map((event) => generateJsonData(event));

  return (
    <Events
      events={events}
      jsonEvents={jsonEvents}
      metaTitle={`Agenda ${currentYear} - Esdeveniments.cat`}
      metaDescription={`Esdeveniments.cat és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a. L'agenda és col·laborativa.`}
      title={`Agenda ${currentYear}`}
      subTitle={`Viu aquest ${month} com mai amb les millors activitats de la temporada: mercats, exposicions, descobriments, passejades, concerts, museus, teatre... 
      No et quedis sense provar tots aquests plans imprescindibles per aprofitar-lo al màxim!`}
      description="Vols viure experiències úniques i emocionants? La cultura és el lloc on cal estar! Us oferim una gran varietat d'opcions perquè mai us avorriu i sempre tingueu
      alguna cosa interessant per fer. Descobriu tot el que passa a Catalunya i voltants, i deixeu-vos sorprendre per la seva riquesa cultural."
      noEventsFound={false}
      canonical={canonical}
      isLoading={isLoading}
      isValidating={isValidating}
      loadMore
      page={page}
      setPage={setPage}
    />
  );
}

export async function getStaticProps() {
  const { getCalendarEvents } = require("@lib/helpers");
  const { twoWeeksDefault } = require("@lib/dates");
  const { from, until } = twoWeeksDefault();

  const { events } = await getCalendarEvents({
    from,
    until,
  });
  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return {
    props: { events: normalizedEvents, currentYear: new Date().getFullYear() },
    revalidate: 60,
  };
}
