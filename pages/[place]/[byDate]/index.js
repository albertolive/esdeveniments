import dynamic from "next/dynamic";

const Events = dynamic(() => import("@components/ui/events"), {
  loading: () => "",
});

export default function App(props) {
  return <Events props={props} />;
}

export async function getStaticPaths() {
  if (
    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "development"
  ) {
    const { CITIES_DATA, BYDATES } = require("@utils/constants");
    const paths = [];

    for (const [regionKey, region] of CITIES_DATA) {
      // Add paths for regions
      const regionDatePaths = BYDATES.map((byDate) => ({
        params: {
          place: regionKey,
          byDate: byDate.value,
        },
      }));
      paths.push(...regionDatePaths);

      // Add paths for towns
      for (const [townKey] of region.towns) {
        const townDatePaths = BYDATES.map((byDate) => ({
          params: {
            place: townKey,
            byDate: byDate.value,
          },
        }));
        paths.push(...townDatePaths);
      }
    }

    return { paths, fallback: false };
  }

  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const { getCalendarEvents } = require("@lib/helpers");
  const { getPlaceTypeAndLabel } = require("@utils/helpers");
  const {
    today,
    tomorrow,
    week,
    weekend,
    twoWeeksDefault,
  } = require("@lib/dates");

  const { place, byDate } = params;

  const dateFunctions = {
    avui: today,
    dema: tomorrow,
    setmana: week,
    "cap-de-setmana": weekend,
  };

  const selectedFunction = dateFunctions[byDate] || today;

  const { type, label, regionLabel } = getPlaceTypeAndLabel(place);
  const q = type === "town" ? `${label} ${regionLabel}` : label;

  const { from, until } = selectedFunction();
  let { events } = await getCalendarEvents({ from, until, q });

  let noEventsFound = false;

  if (events.length === 0) {
    const { from, until } = twoWeeksDefault();
    const nextEventsResult = await getCalendarEvents({
      from,
      until,
      maxResults: 7,
      q,
      town: type === "town" ? label : "",
    });

    noEventsFound = true;
    events = nextEventsResult.events;
  }

  return {
    props: {
      events,
      noEventsFound,
      ...params,
      currentYear: new Date().getFullYear(),
    },
    revalidate: 60,
  };
}
