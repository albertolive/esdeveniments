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
    data: fetchedData = {},
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

  const categorizedEvents = Object.keys(fetchedData.categorizedEvents || {})
    .length
    ? fetchedData.categorizedEvents
    : initialCategorizedEvents;

  const latestEvents = fetchedData.latestEvents?.length
    ? fetchedData.latestEvents
    : initialLatestEvents;

  // Effects
  useEffect(() => {
    setIsLoading(!categorizedEvents && !error && !isValidating);
  }, [categorizedEvents, error, isValidating]);

  const eventKeys = Object.keys(categorizedEvents.events || {});

  const jsonEvents = [
    ...eventKeys
      .flatMap((category) => categorizedEvents.events[category] || [])
      .filter(({ isAd }) => !isAd)
      .map((event) => {
        try {
          return generateJsonData(event);
        } catch (err) {
          console.error("Error generating JSON data for event:", err, event);
          return null;
        }
      })
      .filter(Boolean),
    ...latestEvents
      .filter(({ isAd }) => !isAd)
      .map((event) => {
        try {
          return generateJsonData(event);
        } catch (err) {
          console.error(
            "Error generating JSON data for latest event:",
            err,
            event
          );
          return null;
        }
      })
      .filter(Boolean),
  ];

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
      <div className="w-full flex-col justify-center items-center sm:px-10 sm:w-[580px] mt-40">
        <>
          <h1 className="uppercase mb-4 px-4">{title}</h1>
          <h2 className="text-[16px] font-normal text-blackCorp text-left mb-10 px-4">
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
            {eventKeys.length > 0 &&
              eventKeys.map((category) =>
                categorizedEvents.events[category]?.length > 0 ? (
                  <div key={category}>
                    <h1 className="text-lg font-semibold mt-4 mb-2">
                      {category}
                    </h1>
                    <EventsHorizontalScroll
                      events={categorizedEvents.events[category]}
                    />
                  </div>
                ) : null
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
