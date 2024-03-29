import dynamic from "next/dynamic";

const Events = dynamic(() => import("@components/ui/events"), {
  loading: () => "",
});

export default function App(props) {
  return <Events props={props} />;
}

export async function getStaticPaths() {
  const { CITIES_DATA } = require("@utils/constants");

  const paths = [];

  for (const [regionKey, region] of CITIES_DATA) {
    // Add path for region
    paths.push({
      params: {
        place: regionKey,
      },
    });

    // Add paths for towns
    for (const [townKey] of region.towns) {
      paths.push({
        params: {
          place: townKey,
        },
      });
    }
  }

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { getCalendarEvents } = require("@lib/helpers");
  const { getPlaceTypeAndLabel } = require("@utils/helpers");
  const { twoWeeksDefault } = require("@lib/dates");
  const { from, until } = twoWeeksDefault();
  const { place } = params;
  const { type, label, regionLabel } = getPlaceTypeAndLabel(place);
  const { events } = await getCalendarEvents({
    from,
    until,
    q: type === "town" ? `${label} ${regionLabel}` : label,
    shuffleItems: true,
    town: type === "town" ? label : "",
  });

  return {
    props: {
      events,
      currentYear: new Date().getFullYear(),
      ...params,
    },

    revalidate: 60,
  };
}
