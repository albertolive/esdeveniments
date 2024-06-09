import { memo, useEffect, useState } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";
import Meta from "@components/partials/seo-meta";
import { generatePagesData } from "@components/partials/generatePagesData";
import { useGetCategorizedEvents } from "@components/hooks/useGetCategorizedEvents";
import { generateJsonData } from "@utils/helpers";
import { MAX_RESULTS } from "@utils/constants";
import List from "@components/ui/list";
import CardLoading from "@components/ui/cardLoading";
import Card from "@components/ui/card";
import EventsHorizontalScroll from "@components/ui/eventsHorizontalScroll";
import useStore from "@store";

const NoEventsFound = dynamic(
  () => import("@components/ui/common/noEventsFound"),
  {
    loading: () => "",
  }
);

function EventsCategorized() {
  const {
    categorizedEvents: initialCategorizedEvents,
    latestEvents: initialLatestEvents,
    place,
    byDate,
    currentYear,
  } = useStore((state) => ({
    categorizedEvents: state.categorizedEvents,
    latestEvents: state.latestEvents,
    place: state.place,
    byDate: state.byDate,
    currentYear: state.currentYear,
  }));

  const [isLoading, setIsLoading] = useState(true);

  const {
    data: {
      categorizedEvents = [],
      latestEvents = [],
      noEventsFound = false,
      allEventsLoaded,
    } = {},
    isValidating,
    error,
  } = useGetCategorizedEvents({
    props: {
      categorizedEvents: initialCategorizedEvents,
      latestEvents: initialLatestEvents,
    },
    searchTerms: ["Festa Major", "Familiar", "Teatre"],
    maxResults: MAX_RESULTS,
  });
  console.log("EventsCategorized", categorizedEvents, isValidating);

  // Effects
  useEffect(() => {
    setIsLoading(!categorizedEvents && !error && !isValidating);
  }, [categorizedEvents, error, isValidating]);

  const jsonEvents = Object.values(categorizedEvents || {})
    .flatMap((category) => category)
    .filter(({ isAd }) => !isAd)
    .map((event) => generateJsonData(event));

  // Error handling
  if (error) return <NoEventsFound title="No events found" />;

  // Page data
  const { metaTitle, metaDescription, title, subTitle, canonical } =
    generatePagesData({
      currentYear: currentYear || new Date().getFullYear(),
      place,
      byDate,
    }) || {};

  // Render
  return (
    <>
      <Script
        id={`${place || "catalunya"}-${byDate || "all"}-script`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonEvents) }}
      />
      <Meta
        title={metaTitle}
        description={metaDescription}
        canonical={canonical}
      />
      <div className="w-full flex-col justify-center items-center sm:px-10 sm:w-[580px] mt-24">
        <>
          <h1 className="leading-8 font-semibold text-blackCorp text-left uppercase italic mb-4 px-4">
            {title}
          </h1>
          <h2 className="text-[16px] font-normal text-blackCorp text-left mb-4 px-4">
            {subTitle}
          </h2>
        </>
        {isLoading || isValidating ? (
          <div>
            {[...Array(10)].map((_, i) => (
              <CardLoading key={i} />
            ))}
          </div>
        ) : (
          <div className="p-2">
            {categorizedEvents &&
              Object.keys(categorizedEvents).length > 0 &&
              Object.keys(categorizedEvents.events || {}).map(
                (category) =>
                  categorizedEvents.events[category]?.length > 0 && (
                    <div key={category}>
                      <h1 className="text-lg font-semibold mt-4 mb-2">
                        {category}
                      </h1>
                      <EventsHorizontalScroll
                        events={categorizedEvents.events[category]}
                      />
                    </div>
                  )
              )}
            {latestEvents.length > 0 && (
              <>
                <h1 className="text-lg font-semibold mt-4 mb-2">
                  Altres esdeveniments
                </h1>
                <List events={latestEvents}>
                  {(event, index) => (
                    <Card
                      key={event.id}
                      event={event}
                      isPriority={index === 0}
                    />
                  )}
                </List>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default memo(EventsCategorized);
