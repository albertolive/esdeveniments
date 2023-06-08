import Link from "next/link";
import dynamic from "next/dynamic";
import { monthsName, generateJsonData } from "@utils/helpers";
import { useGetEvents } from "@components/hooks/useGetEvents";
import { getRegionLabel, getTownLabel } from "@utils/normalize";

const Events = dynamic(() => import("@components/ui/events"), {
  loading: () => "",
});

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

const generateData = (byDate, town, townLabel, currentYear) => {
  if (byDate === "avui") {
    return {
      title: `Què fer ${byDate} a ${townLabel}`,
      subTitle: `Aprofita el teu temps i troba el que necessites: el millor del dia al teu abast.`,
      description: (
        <>
          Les coses per fer a {townLabel} no descansen ni un dia.{" "}
          <Link href={`/${town}/setmana`} prefetch={false}>
            <a className="font-medium text-black underline">Cada setmana</a>
          </Link>
          , descobrireu centenars d&apos;activitats increïbles per tots els
          racons. Perquè us sigui més fàcil la tria, us ajudem a trobar el pla
          ideal per a vosaltres: cinema alternatiu, l&apos;exposició imperdible,
          l&apos;obra de teatre de la qual tothom parla, mercats, activitats
          familiars... Us oferim tota la informació per gaudir de {townLabel} i
          de la seva enorme activitat cultural. No cal moderació, la podeu
          gaudir a l&apos;engròs.
        </>
      ),
      metaTitle: `Què fer ${byDate} a ${townLabel}`,
      metaDescription: `Què fer ${byDate} a ${townLabel}. Us oferim tota la informació per gaudir de ${townLabel} i de la seva enorme activitat cultural: cinema, museus, teatre, mercats, familiar. . Us oferim tota la informació per gaudir de ${townLabel} i de la seva enorme activitat cultural: cinema, museus, teatre, mercats, familiar.`,
    };
  } else if (byDate === "setmana") {
    return {
      title: `Coses per fer a ${townLabel} aquesta ${byDate}`,
      subTitle: `Us proposem activitats d'oci i cultura a ${townLabel} per a tots els gustos i butxaques.`,
      description: `Teniu ganes de gaudir de aquesta setmana? Esteu en el lloc correcte! Us hem fet
      una selecció dels plans d'aquesta setmana que engloben el millor de
      tots els àmbits i per a tots els públics. Teatre, cinema, música, art i
      altres excuses per no parar de descobrir ${townLabel}!`,
      metaTitle: `Què fer aquesta ${byDate} a ${townLabel}`,
      metaDescription: `Què fer aquesta ${byDate} a ${townLabel}. Teniu ganes de gaudir de aquesta setmana? Teatre, cinema, música, art i altres excuses per no parar de descobrir ${townLabel}!`,
    };
  } else if (byDate === "cap-de-setmana") {
    return {
      title: `Què fer aquest cap de setmana a ${townLabel}`,
      subTitle: `Les millors propostes per esprémer al màxim el cap de setmana a ${townLabel}, de divendres a diumenge.`,
      description: `Hem bussejat en l'agenda cultural de ${townLabel} i us portem una tria
      del milloret que podreu fer aquest cap de setmana. Art, cinema,
      teatre... No teniu excusa, us espera un cap de setmana increïble sense
      moure-us de ${townLabel}.`,
      metaTitle: `Què fer aquest cap de setmana a ${townLabel}`,
      metaDescription: `Què fer aquest cap de setmana a ${townLabel}. Les millors propostes culturals per esprémer al màxim el cap de setmana, de divendres a diumenge.`,
    };
  }
};

const dateFunctions = {
  avui: "today",
  setmana: "week",
  "cap-de-setmana": "weekend",
};

export default function App(props) {
  const { town, byDate, region, currentYear } = props;
  const {
    data: { events = [], noEventsFound = false },
    error,
    isLoading,
    isValidating,
  } = useGetEvents({
    props,
    pageIndex: dateFunctions[byDate] || "all",
    q: `${getTownLabel(town) || ""} ${getRegionLabel(region) || ""}`,
  });

  if (error) return <div>failed to load</div>;

  const jsonEvents = events
    .filter(({ isAd }) => !isAd)
    .map((event) => generateJsonData(event));

  const townLabel = getTownLabel(town);
  const { title, subTitle, description, metaTitle, metaDescription } =
    generateData(byDate, town, townLabel, currentYear);
  const canonical = `${siteUrl}/${region}/${town}/${byDate}`;

  return (
    <Events
      events={events}
      jsonEvents={jsonEvents}
      metaTitle={metaTitle}
      metaDescription={metaDescription}
      title={title}
      subTitle={subTitle}
      description={description}
      noEventsFound={noEventsFound}
      byDate={byDate}
      townLabel={townLabel}
      canonical={canonical}
      isLoading={isLoading}
      isValidating={isValidating}
    />
  );
}

export async function getStaticPaths() {
  const { CITIES_DATA, BYDATES } = require("@utils/constants");

  const paths = [];

  for (const [regionKey, region] of CITIES_DATA.entries()) {
    for (const [townKey, town] of region.towns.entries()) {
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
  const { town, region, byDate } = params;
  const { today, week, weekend, twoWeeksDefault } = require("@lib/dates");
  const dateFunctions = {
    avui: today,
    setmana: week,
    "cap-de-setmana": weekend,
  };
  const selectedFunction = dateFunctions[byDate];

  const { from, until } = selectedFunction();
  const { events: todayEvents } = await getCalendarEvents({
    from,
    until,
    q: `${getTownLabel(town) || ""} ${getRegionLabel(region) || ""}`,
  });

  let events = todayEvents;
  let noEventsFound = false;

  if (events.length === 0) {
    const { from, until } = twoWeeksDefault();

    const { events: nextEvents } = await getCalendarEvents({
      from,
      until,
      maxResults: 7,
      q: `${getTownLabel(town) || ""} ${getRegionLabel(region) || ""}`,
    });

    noEventsFound = true;
    events = nextEvents;
  }

  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return {
    props: {
      events: normalizedEvents,
      noEventsFound,
      ...params,
      currentYear: new Date().getFullYear(),
    },
    revalidate: 60,
  };
}
