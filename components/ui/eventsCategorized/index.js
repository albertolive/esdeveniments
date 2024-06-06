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
import { useFilters } from "@components/hooks/useFilters";

const NoEventsFound = dynamic(
  () => import("@components/ui/common/noEventsFound"),
  {
    loading: () => "",
  }
);

function EventsCategorized() {
  const { state } = useFilters();

  const [isLoading, setIsLoading] = useState(true);
  const [eventsData, setEventsData] = useState({
    categorizedEvents: state.categorizedEvents.events || {},
    latestEvents: state.latestEvents || [],
    noEventsFound: false,
    currentYear: state.currentYear,
  });

  const {
    data: fetchedData = {},
    isValidating,
    error,
  } = useGetCategorizedEvents({
    props: {
      categorizedEvents: state.categorizedEvents,
      latestEvents: state.latestEvents,
    },
    searchTerms: ["Festa Major", "Familiar", "Teatre"],
    maxResults: MAX_RESULTS,
  });

  useEffect(() => {
    if (fetchedData.categorizedEvents?.events || fetchedData.latestEvents) {
      setEventsData({
        categorizedEvents: fetchedData.categorizedEvents?.events || {},
        latestEvents: fetchedData.latestEvents || [],
        noEventsFound: fetchedData.noEventsFound,
        currentYear: fetchedData.currentYear,
      });
      setIsLoading(false);
    }
  }, [fetchedData]);

  const jsonEvents = Object.values(eventsData.categorizedEvents || {})
    .flatMap((category) => category)
    .filter(({ isAd }) => !isAd)
    .map((event) => generateJsonData(event));

  // Error handling
  if (error) return <NoEventsFound title="No events found" />;

  // Page data
  const { metaTitle, metaDescription, title, subTitle, canonical } =
    generatePagesData({
      currentYear: eventsData.currentYear || new Date().getFullYear(),
      place: state.place,
      byDate: state.byDate,
    }) || {};

  // Render
  return (
    <>
      <Script
        id={`${state.place || "catalunya"}-${state.byDate || "all"}-script`}
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
            {Object.keys(eventsData.categorizedEvents).map(
              (category) =>
                eventsData.categorizedEvents[category].length > 0 && (
                  <div key={category}>
                    <h1 className="text-lg font-semibold mt-4 mb-2">
                      {category}
                    </h1>
                    <EventsHorizontalScroll
                      events={eventsData.categorizedEvents[category]}
                    />
                  </div>
                )
            )}
            <h1 className="text-lg font-semibold mt-4 mb-2">
              Altres esdeveniments
            </h1>
            <List events={eventsData.latestEvents}>
              {(event, index) => (
                <Card key={event.id} event={event} isPriority={index === 0} />
              )}
            </List>
          </div>
        )}
      </div>
    </>
  );
}

export default memo(EventsCategorized);
