import { getCategorizedEvents, getLatestEvents } from "@lib/helpers";
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

export async function getServerSideProps() {
  const { from, until } = twoWeeksDefault();
  const searchTerms = ["Festa Major", "Familiar", "Teatre"];

  const initialState = {
    page: 1,
    openModal: false,
    place: "",
    byDate: "",
    category: "",
    searchTerm: "",
    userLocation: null,
    distance: "",
    scrollButton: false,
    navigatedFilterModal: false,
    categorizedEvents: {},
    latestEvents: [],
    currentYear: new Date().getFullYear(),
  };

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

  return {
    props: {
      initialState,
    },
  };
}
