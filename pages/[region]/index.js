import { useState } from "react";
import dynamic from "next/dynamic";
import { generateJsonData } from "@utils/helpers";
import { useGetEvents } from "@components/hooks/useGetEvents";
import { getRegionLabel } from "@utils/helpers";
import { dateFunctions } from "@utils/constants";

const Events = dynamic(() => import("@components/ui/events"), {
  loading: () => "",
});

export default function App(props) {
  const {
    town: townProps,
    byDate: byDateProps,
    region: regionProps,
    currentYear,
  } = props;
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
    q: getRegionLabel(region) || "",
    maxResults: page * 10,
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

  for (const [regionKey, region] of CITIES_DATA) {
    for (const [townKey] of region.towns) {
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
  const { twoWeeksDefault } = require("@lib/dates");
  const { from, until } = twoWeeksDefault();
  const { region } = params;
  const { events } = await getCalendarEvents({
    from,
    until,
    q: getRegionLabel(region) || "",
  });
  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return {
    props: {
      events: normalizedEvents,
      currentYear: new Date().getFullYear(),
      ...params,
    },

    revalidate: 60,
  };
}
