import Events from "@components/ui/events";

export default function App(props) {
  return <Events props={props} />;
}

export async function getStaticProps() {
  const { getCalendarEvents } = require("@lib/helpers");
  const { twoWeeksDefault } = require("@lib/dates");
  const { MAX_RESULTS } = require("@utils/constants");
  const { from, until } = twoWeeksDefault();

  const { events } = await getCalendarEvents({
    from,
    until,
    maxResults: MAX_RESULTS,
    shuffleItems: true,
  });
  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return {
    props: { events: normalizedEvents, currentYear: new Date().getFullYear() },
    revalidate: 60,
  };
}
