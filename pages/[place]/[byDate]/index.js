import { useEffect } from "react";
import dynamic from "next/dynamic";
import { getCalendarEvents } from "@lib/helpers";
import { getPlaceTypeAndLabel } from "@utils/helpers";
import { initializeStore } from "@utils/initializeStore";
import { today, tomorrow, week, weekend, twoWeeksDefault } from "@lib/dates";

const CardLoadingExtended = dynamic(
  () => import("@components/ui/cardLoadingExtended"),
  {
    loading: () => (
      <div className="flex justify-center items-center w-full">
        <div className="w-full h-60 bg-darkCorp animate-fast-pulse"></div>
      </div>
    ),
  }
);

const Events = dynamic(() => import("@components/ui/events"), {
  ssr: true,
});

const EventsCategorized = dynamic(
  () => import("@components/ui/eventsCategorized"),
  {
    loading: () => <CardLoadingExtended />,
    ssr: false,
  }
);

const EventsList = dynamic(() => import("@components/ui/eventsList"), {
  ssr: true,
});

export default function ByDate({ initialState }) {
  useEffect(() => {
    initializeStore(initialState);
  }, [initialState]);

  return (
    <Events
      events={initialState.events}
      hasServerFilters={initialState.hasServerFilters}
      ListComponent={EventsList}
      CategorizedComponent={EventsCategorized}
    />
  );
}

export async function getStaticPaths() {
  if (
    (false && process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") ||
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

  if (events.length === 0) {
    const { from, until } = twoWeeksDefault();
    const nextEventsResult = await getCalendarEvents({
      from,
      until,
      maxResults: 7,
      q: label,
    });

    noEventsFound = true;
    events = nextEventsResult.events;
  }

  const initialState = {
    place,
    byDate,
    events,
    noEventsFound,
    hasServerFilters: true,
  };

  return {
    props: {
      initialState,
    },
    revalidate: 60,
  };
}
