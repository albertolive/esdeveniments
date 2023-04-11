import Link from "next/link";
import Script from "next/script";
import dynamic from "next/dynamic";
import { generateJsonData } from "@utils/helpers";
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

const Card = dynamic(() => import("@components/ui/card"), {
  loading: () => "",
});

export default function App(props) {
  const {
    data: { events = [], noEventsFound = false },
    error,
    isLoading,
    isValidating,
  } = useGetEvents({ props, pageIndex: "today" });

  if (error) return <div>failed to load</div>;

  const jsonData = events
    .filter(({ isAd }) => !isAd)
    .map((event) => generateJsonData(event));

  return (
    <>
      <Script
        id="avui-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonData) }}
      />
      <Meta
        title="Que fer avui a Cardedeu - Cultura Cardedeu"
        description="Què fer avui a Cardedeu. Us oferim tota la informació per gaudir de Cardedeu i de la seva enorme activitat cultural: cinema, museus, teatre, mercats, familiar."
        canonical="https://www.culturacardedeu.com/avui-a-cardedeu"
      />
      <SubMenu />
      <div className="reset-this">
        <h1 className="mb-4 block text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Què fer avui a Cardedeu
        </h1>
      </div>
      <p className="mb-4 font-bold">
        Aprofita el teu temps i troba el que necessites: el millor del dia al
        teu abast.
      </p>
      <p className="mb-4">
        Les coses per fer a Cardedeu no descansen ni un dia.{" "}
        <Link href="/setmana-a-cardedeu" prefetch={false}>
          <a className="font-medium text-black underline">
            Cada setmana, descobrireu centenars d&apos;activitats increïbles
          </a>
        </Link>{" "}
        per tots els racons del poble. Perquè us sigui més fàcil la tria, us
        ajudem a trobar el pla ideal per a vosaltres: cinema alternatiu,
        l&apos;exposició imperdible, l&apos;obra de teatre de la qual tothom
        parla, mercats, activitats familiars... Us oferim tota la informació per
        gaudir de Cardedeu i de la seva enorme activitat cultural. No cal
        moderació, la podeu gaudir a l&apos;engròs.
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
  const { today, twoWeeksDefault } = require("@lib/dates");

  const { from, until } = today();
  const { events: todayEvents } = await getCalendarEvents({
    from,
    until,
  });

  let events = todayEvents;
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
    props: { events: normalizedEvents, noEventsFound },
    revalidate: 60,
  };
}
