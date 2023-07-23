import { useState } from "react";
import { useGetEvents } from "@components/hooks/useGetEvents";
import { generateJsonData, getRegionLabel, getTownLabel } from "@utils/helpers";
import { dateFunctions } from "@utils/constants";
import Events from "@components/ui/events";

export default function App(props) {
  const [page, setPage] = useState(() => {
    const storedPage =
      typeof window !== "undefined" &&
      window.localStorage.getItem("currentPage");
    return storedPage ? parseInt(storedPage) : 1;
  });
  const [region, setRegion] = useState();
  const [town, setTown] = useState();
  const [byDate, setByDate] = useState();
  const {
    data: { events = [], currentYear, noEventsFound = false },
    error,
    isLoading,
    isValidating,
  } = useGetEvents({
    props,
    pageIndex: dateFunctions[byDate] || "all",
    maxResults: page * 10,
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

export async function getStaticProps() {
  const { getCalendarEvents } = require("@lib/helpers");
  const { twoWeeksDefault } = require("@lib/dates");
  const { from, until } = twoWeeksDefault();

  const { events } = await getCalendarEvents({
    from,
    until,
  });
  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return {
    props: { events: normalizedEvents, currentYear: new Date().getFullYear() },
    revalidate: 60,
  };
}
