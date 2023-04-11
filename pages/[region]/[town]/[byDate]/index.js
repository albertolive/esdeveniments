import Link from "next/link";
import Script from "next/script";
import dynamic from "next/dynamic";
import { monthsName, generateJsonData } from "@utils/helpers";
import List from "@components/ui/list";
import { useGetEvents } from "@components/hooks/useGetEvents";
import SubMenu from "@components/ui/common/subMenu";
import Meta from "@components/partials/seo-meta";
import { capitalizeFirstLetter } from "@utils/normalize";

const NoEventsFound = dynamic(
  () => import("@components/ui/common/noEventsFound"),
  {
    loading: () => "",
  }
);

const Card = dynamic(() => import("@components/ui/card"), {
  loading: () => "",
});

const generateData = (byDate, town, townCapitalized, currentYear) => {
  if (byDate === "avui") {
    return {
      title: `Què fer ${byDate} a ${townCapitalized}`,
      subTitle: `Aprofita el teu temps i troba el que necessites: el millor del dia al teu abast.`,
      description: (
        <>
          Les coses per fer a {townCapitalized} no descansen ni un dia.{" "}
          <Link href={`/${town}/setmana`} prefetch={false}>
            <a className="font-medium text-black underline">Cada setmana</a>
          </Link>
          , descobrireu centenars d&apos;activitats increïbles per tots els
          racons. Perquè us sigui més fàcil la tria, us ajudem a trobar el pla
          ideal per a vosaltres: cinema alternatiu, l&apos;exposició imperdible,
          l&apos;obra de teatre de la qual tothom parla, mercats, activitats
          familiars... Us oferim tota la informació per gaudir de{" "}
          {townCapitalized} i de la seva enorme activitat cultural. No cal
          moderació, la podeu gaudir a l&apos;engròs.
        </>
      ),
      metaTitle: `Què fer ${byDate} a ${townCapitalized}`,
      metaDescription: `Què fer ${byDate} a ${townCapitalized}. Us oferim tota la informació per gaudir de ${townCapitalized} i de la seva enorme activitat cultural: cinema, museus, teatre, mercats, familiar. . Us oferim tota la informació per gaudir de ${townCapitalized} i de la seva enorme activitat cultural: cinema, museus, teatre, mercats, familiar.`,
    };
  } else if (byDate === "setmana") {
    return {
      title: `Coses per fer a ${townCapitalized} aquesta ${byDate}`,
      subTitle: `Us proposem activitats d'oci i cultura a ${townCapitalized} per a tots els gustos i butxaques.`,
      description: `Teniu ganes de gaudir de aquesta setmana? Esteu en el lloc correcte! Us hem fet
      una selecció dels plans d'aquesta setmana que engloben el millor de
      tots els àmbits i per a tots els públics. Teatre, cinema, música, art i
      altres excuses per no parar de descobrir ${townCapitalized}!`,
      metaTitle: `Què fer aquesta ${byDate} a ${townCapitalized}`,
      metaDescription: `Què fer aquesta ${byDate} a ${townCapitalized}. Teniu ganes de gaudir de aquesta setmana? Teatre, cinema, música, art i altres excuses per no parar de descobrir ${townCapitalized}!`,
    };
  } else if (byDate === "cap-de-setmana") {
    return {
      title: `Què fer aquest cap de setmana a ${townCapitalized}`,
      subTitle: `Les millors propostes per esprémer al màxim el cap de setmana a ${townCapitalized}, de divendres a diumenge.`,
      description: `Hem bussejat en l'agenda cultural de ${townCapitalized} i us portem una tria
      del milloret que podreu fer aquest cap de setmana. Art, cinema,
      teatre... No teniu excusa, us espera un cap de setmana increïble sense
      moure-us de ${townCapitalized}.`,
      metaTitle: `Què fer aquest cap de setmana a ${townCapitalized}`,
      metaDescription: `Què fer aquest cap de setmana a ${townCapitalized}. Les millors propostes culturals per esprémer al màxim el cap de setmana, de divendres a diumenge.`,
    };
  }

  return {
    title: `Agenda ${townCapitalized} ${currentYear}`,
    subTitle: `Les millors coses per fer a ${townCapitalized}: mercats, exposicions,
    descobriments, passejades, concerts, museus, teatre... Aquests són els
    millors plans per gaudir de ${townCapitalized} al${" "}
    ${monthsName[new Date().getMonth()]}!`,
    description: (
      <>
        Us donem un ventall de possibilitats perquè no us quedi temps per
        avorrir-vos. La cultura no descansa. Podeu veure què passa{" "}
        <Link href={`/${town}/avui`} prefetch={false}>
          <a className="font-medium text-black underline">avui</a>
        </Link>
        ,{" "}
        <Link href={`/${town}/setmana`} prefetch={false}>
          <a className="font-medium text-black underline">aquesta setmana</a>
        </Link>
        , o ve,{" "}
        <Link href={`/${town}cap-de-setmana`} prefetch={false}>
          <a className="font-medium text-black underline">el cap de setmana</a>
        </Link>{" "}
        a {townCapitalized}. Ja no teniu cap excusa, per no estar al dia, de tot
        el que passa a {townCapitalized} vinculat a la cultura!
      </>
    ),
    metaTitle: `Agenda ${currentYear}`,
    metaDescription: `Què fer és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a ${townCapitalized}. L'agenda és col·laborativa.`,
  };
};

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

  const { town, byDate, currentYear } = props;
  const townCapitalized = capitalizeFirstLetter(town);
  const { title, subTitle, description, metaTitle, metaDescription } =
    generateData(byDate, town, townCapitalized, currentYear);

  return (
    <>
      <Script
        id="avui-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonData) }}
      />
      <Meta
        title={`${metaTitle} - Què fer`}
        description={`${metaDescription}`}
        canonical="https://www.culturacardedeu.com/avui-a-cardedeu"
      />
      <SubMenu />
      <div className="reset-this">
        <h1 className="mb-4 block text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>
      </div>
      <p className="mb-4 font-bold">{subTitle}</p>
      <p className="mb-4">{description}</p>
      {noEventsFound && (
        <NoEventsFound
          title={`Ho sentim, però no hi ha esdeveniments ${byDate} a ${townCapitalized}. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`}
        />
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
    props: {
      events: normalizedEvents,
      noEventsFound,
      ...params,
      currentYear: new Date().getFullYear(),
    },
    revalidate: 60,
  };
}
