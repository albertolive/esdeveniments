import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import Card from "@components/ui/card";
import List from "@components/ui/list";
import { useGetEvents } from "@components/hooks/useGetEvents";
import SubMenu from "@components/ui/common/subMenu";
import { monthsName, generateJsonData } from "@utils/helpers";
import Meta from "@components/partials/seo-meta";

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

  const sendGA = () => {
    if (typeof window !== "undefined") {
      window.gtag && window.gtag("event", "load-more-events");
    }
  };

  useEffect(() => {
    localStorage.setItem("currentPage", page);
  }, [page]);

  useEffect(() => {
    localStorage.removeItem("currentPage");
  }, []);

  if (error) return <div>failed to load</div>;

  const jsonData = events
    .filter(({ isAd }) => !isAd)
    .map((event) => generateJsonData(event));

  return (
    <>
      <Script
        id="agenda-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonData) }}
      />
      <Meta
        title={`Agenda ${currentYear} - Cultura Cardedeu`}
        description="Cultura Cardedeu és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a Cardedeu. L'agenda és col·laborativa."
        canonical="https://www.culturacardedeu.com/"
      />
      <SubMenu />
      <div className="reset-this">
        <h1 className="mb-4 block text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Agenda Cardedeu {currentYear}
        </h1>
      </div>
      <p className="mb-4 font-bold">
        Les millors coses per fer a Cardedeu: mercats, exposicions,
        descobriments, passejades, concerts, museus, teatre... Aquests són els
        millors plans per gaudir de Cardedeu al{" "}
        {monthsName[new Date().getMonth()]}!
      </p>
      <p className="mb-4">
        Us donem un ventall de possibilitats perquè no us quedi temps per
        avorrir-vos. La cultura no descansa. Podeu veure què passa{" "}
        <Link href="/avui-a-cardedeu" prefetch={false}>
          <a className="font-medium text-black underline">avui</a>
        </Link>
        ,{" "}
        <Link href="/setmana-a-cardedeu" prefetch={false}>
          <a className="font-medium text-black underline">aquesta setmana</a>
        </Link>
        , o ve,{" "}
        <Link href="/cap-de-setmana-a-cardedeu" prefetch={false}>
          <a className="font-medium text-black underline">el cap de setmana</a>
        </Link>{" "}
        a Cardedeu. Ja no teniu cap excusa, per no estar al dia, de tot el que
        passa a Cardedeu vinculat a la cultura!
      </p>
      <List events={events}>
        {(event) => (
          <Card
            key={event.id}
            event={event}
            isLoading={isLoading}
            isValidating={isValidating}
          />
        )}
      </List>
      <div className="text-center">
        <button
          type="button"
          className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-[#ECB84A] hover:bg-yellow-400 focus:outline-none"
          onClick={() => {
            setPage((prevPage) => prevPage + 1);
            sendGA();
          }}
        >
          <span className="text-white">Carregar més</span>
        </button>
      </div>
    </>
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
