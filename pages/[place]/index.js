import dynamic from "next/dynamic";

const Events = dynamic(() => import("@components/ui/events"), {
  loading: () => "",
});

export default function App(props) {
  return <Events props={props} />;
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
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
