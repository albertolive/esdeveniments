import {
  getCategorizedEvents,
  getLatestEvents,
  getCalendarEvents,
} from "@lib/helpers";
import { twoWeeksDefault } from "@lib/dates";
import { MAX_RESULTS } from "@utils/constants";
import Events from "@components/ui/events";
import { FilterProvider } from "@components/context/filterContext";

export default function Home(props) {
  return (
    <FilterProvider initialState={props.initialState}>
      <Events props={props} />
    </FilterProvider>
  );
}

export async function getServerSideProps(context) {
  const { from, until } = twoWeeksDefault();
  const searchTerms = ["Festa Major", "Familiar", "Teatre"];
  const { place, byDate, category, searchTerm, distance } = context.query;
  console.log("context.query", context.query);
  const initialState = {
    page: 1,
    openModal: false,
    place: place || "",
    byDate: byDate || "",
    category: category || "",
    searchTerm: searchTerm || "",
    userLocation: null,
    distance: distance || "",
    scrollButton: false,
    navigatedFilterModal: false,
    categorizedEvents: {},
    latestEvents: [],
    currentYear: new Date().getFullYear(),
  };

  const hasFilters =
    Boolean(place) ||
    Boolean(byDate) ||
    Boolean(category) ||
    Boolean(searchTerm) ||
    Boolean(distance);
  console.log("hasFilters", hasFilters);
  if (hasFilters) {
    const { events } = await getCalendarEvents({
      from,
      until,
      maxResults: MAX_RESULTS,
      shuffleItems: true,
    });
    initialState.events = events;
  } else {
    const [categorizedResult, latestResult] = await Promise.allSettled([
      getCategorizedEvents({
        searchTerms,
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
  }

  return {
    props: {
      initialState,
    },
  };
}
