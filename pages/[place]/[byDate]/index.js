import dynamic from "next/dynamic";

const Events = dynamic(() => import("@components/ui/events"), {
  loading: () => "",
});

export default function App(props) {
  return <Events props={props} />;
}

export async function getStaticPaths() {
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

export async function getStaticProps({ params }) {
  const { getCalendarEvents } = require("@lib/helpers");
  const { getTownLabel, getRegionLabel } =  require("@utils/helpers");
  const { place, byDate } = params;
  const { today, week, weekend, twoWeeksDefault } = require("@lib/dates");
  const dateFunctions = {
    avui: today,
    setmana: week,
    "cap-de-setmana": weekend,
  };
  const selectedFunction = dateFunctions[byDate];
  const { type, label, regionLabel } = getPlaceTypeAndLabel(place);
  const q = type === "town" ? `${label} ${regionLabel}` : label;

  const { from, until } = selectedFunction();
  const { events: todayEvents } = await getCalendarEvents({
    from,
    until,
    q
  });

  let events = todayEvents;
  let noEventsFound = false;

  if (events.length === 0) {
    const { from, until } = twoWeeksDefault();

    const { events: nextEvents } = await getCalendarEvents({
      from,
      until,
      maxResults: 7,
      q
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
