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

  for (const [regionKey, region] of CITIES_DATA.entries()) {
    for (const [townKey] of region.towns.entries()) {
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
  const { getTownLabel, getRegionLabel } =  require("@utils/helpers");
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
