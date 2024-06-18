import { lazy, useEffect } from "react";
import { getCategorizedEvents, getLatestEvents } from "@lib/helpers";
import { twoWeeksDefault } from "@lib/dates";
import { MAX_RESULTS, SEARCH_TERMS_SUBSET } from "@utils/constants";
import Events from "@components/ui/events";
import EventsCategorized from "@components/ui/eventsCategorized";
import { initializeStore } from "@utils/initializeStore";

const EventsList = lazy(() => import("@components/ui/eventsList"));

export default function Home({ initialState }) {
  useEffect(() => {
    initializeStore(initialState);
  }, [initialState]);

  return (
    <Events
      CategorizedComponent={EventsCategorized}
      ListComponent={EventsList}
    />
  );
}

export async function getStaticProps() {
  const { from, until } = twoWeeksDefault();

  const initialState = {};

  const [categorizedResult, latestResult] = await Promise.allSettled([
    getCategorizedEvents({
      searchTerms: SEARCH_TERMS_SUBSET,
      from,
      until,
      maxResults: MAX_RESULTS,
      filterByDate: true,
    }),
    getLatestEvents({
      from,
      until,
      maxResults: MAX_RESULTS,
      filterByDate: true,
    }),
  ]);

  initialState.categorizedEvents =
    categorizedResult.status === "fulfilled" ? categorizedResult.value : {};
  initialState.latestEvents =
    latestResult.status === "fulfilled" ? latestResult.value.events : [];

  return {
    props: {
      initialState,
    },
    revalidate: 60,
  };
}
