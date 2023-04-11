import Script from "next/script";
import dynamic from "next/dynamic";
import { generateJsonData } from "@utils/helpers";
import Card from "@components/ui/card";
import List from "@components/ui/list";
import { useGetEvents } from "@components/hooks/useGetEvents";
import SubMenu from "@components/ui/common/subMenu";
import Meta from "@components/partials/seo-meta";

const NoEventsFound = dynamic(
  () => import("@components/ui/common/noEventsFound"),
  {
    loading: () => "",
  }
);

export default function App(props) {
  const {
    data: { events = [], noEventsFound = false },
    error,
    isLoading,
    isValidating,
  } = useGetEvents({ props, pageIndex: "weekend" });

  if (error) return <div>failed to load</div>;

  const jsonData = events
    .filter(({ isAd }) => !isAd)
    .map((event) => generateJsonData(event));

  return (
    <>
      <Script
        id="cap-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonData) }}
      />
      <Meta
        title="Què fer aquest cap de setmana a Cardedeu - Cultura Cardedeu"
        description="Què fer aquest cap de setmana a Cardedeu. Les millors propostes culturals per esprémer al màxim el cap de setmana, de divendres a diumenge."
        canonical="https://www.culturacardedeu.com/cap-de-setmana-a-cardedeu"
      />
      <SubMenu />
      <div className="reset-this">
        <h1 className="mb-4 block text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Què fer aquest cap de setmana a Cardedeu
        </h1>
      </div>
      <p className="mb-4 font-bold">
        Les millors propostes per esprémer al màxim el cap de setmana a
        Cardedeu, de divendres a diumenge.
      </p>
      <p className="mb-4">
        Hem bussejat en l&apos;agenda cultural de Cardedeu i us portem una tria
        del milloret que podreu fer aquest cap de setmana al poble. Art, cinema,
        teatre... No teniu excusa, us espera un cap de setmana increïble sense
        moure-us de Cardedeu.{" "}
      </p>
      {noEventsFound && (
        <NoEventsFound title="Ho sentim, però no hi ha esdeveniments avui a Cardedeu. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions." />
      )}
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
    </>
  );
}

export async function getStaticProps() {
  const { getCalendarEvents } = require("@lib/helpers");
  const { weekend, twoWeeksDefault } = require("@lib/dates");

  const { from, until } = weekend();
  const { events: weekendEvents } = await getCalendarEvents({
    from,
    until,
  });

  let events = weekendEvents;
  let noEventsFound = false;

  if (events.length === 0) {
    const { from, until } = twoWeeksDefault();

    const { events: nextEvents } = await getCalendarEvents({
      from,
      until,
      maxResults: 7,
    });

    noEventsFound = true;
    events = nextEvents;
  }

  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return {
    props: { events: normalizedEvents },
    revalidate: 60,
  };
}
