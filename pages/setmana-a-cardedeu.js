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
  } = useGetEvents({ props, pageIndex: "week" });

  if (error) return <div>failed to load</div>;

  const jsonData = events
    .filter(({ isAd }) => !isAd)
    .map((event) => generateJsonData(event));

  return (
    <>
      <Script
        id="setmana-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonData) }}
      />
      <Meta
        title="Què fer aquesta setmana a Cardedeu - Cultura Cardedeu"
        description="Què fer aquesta setmana a Cardedeu. Teniu ganes de gaudir del poble? Teatre, cinema, música, art i altres excuses per no parar de descobrir Cardedeu!"
        canonical="https://www.culturacardedeu.com/setmana-a-cardedeu"
      />
      <SubMenu />
      <div className="reset-this">
        <h1 className="mb-4 block text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Coses per fer a Cardedeu aquesta setmana
        </h1>
      </div>
      <p className="mb-4 font-bold">
        Us proposem activitats d&apos;oci i cultura a Cardedeu per a tots els
        gustos i butxaques.
      </p>
      <p className="mb-4">
        Teniu ganes de gaudir del poble? Esteu en el lloc correcte! Us hem fet
        una selecció dels plans d&apos;aquesta setmana que engloben el millor de
        tots els àmbits i per a tots els públics. Teatre, cinema, música, art i
        altres excuses per no parar de descobrir Cardedeu!
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
  const { week, twoWeeksDefault } = require("@lib/dates");

  const { from, until } = week();
  const { events: weekEvents } = await getCalendarEvents({
    from,
    until,
  });

  let events = weekEvents;
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
