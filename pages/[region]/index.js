import dynamic from "next/dynamic";
import { getRegionLabel } from "@utils/helpers";

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
