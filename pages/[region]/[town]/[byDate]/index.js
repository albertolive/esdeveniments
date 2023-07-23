import { useState } from "react";
import dynamic from "next/dynamic";
import { getRegionLabel, getTownLabel, generateJsonData } from "@utils/helpers";
import { useGetEvents } from "@components/hooks/useGetEvents";
import { dateFunctions } from "@utils/constants";

const Events = dynamic(() => import("@components/ui/events"), {
  loading: () => "",
});

export default function App(props) {
  const { town: townProps, byDate: byDateProps, region: regionProps, currentYear } = props;
  const [page, setPage] = useState(() => {
    const storedPage =
      typeof window !== "undefined" &&
      window.localStorage.getItem("currentPage");
    return storedPage ? parseInt(storedPage) : 1;
  });
  const [region, setRegion] = useState(regionProps);
  const [town, setTown] = useState(townProps);
  const [byDate, setByDate] = useState(byDateProps);
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

  const jsonEvents = events.map((event) => generateJsonData(event));

  return (
    <Events
      events={events}
      jsonEvents={jsonEvents}
      noEventsFound={noEventsFound}
      isLoading={isLoading}
      isValidating={isValidating}
      loadMore
      page={page}
      setPage={setPage}
      region={region}
      setRegion={setRegion}
      town={town}
      setTown={setTown}
      byDate={byDate}
      setByDate={setByDate}
      currentYear={currentYear}
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
