import { memo, useCallback, useEffect, useState } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";
import ChevronRightIcon from "@heroicons/react/solid/ChevronRightIcon";
import Meta from "@components/partials/seo-meta";
import { generatePagesData } from "@components/partials/generatePagesData";
import { useGetCategorizedEvents } from "@components/hooks/useGetCategorizedEvents";
import { generateJsonData, sendEventToGA } from "@utils/helpers";
import { MAX_RESULTS } from "@utils/constants";
import List from "@components/ui/list";
import CardLoading from "@components/ui/cardLoading";
import Card from "@components/ui/card";
import EventsHorizontalScroll from "@components/ui/eventsHorizontalScroll";
import useStore from "@store";
import { SEARCH_TERMS_SUBSET, CATEGORY_NAMES_MAP } from "@utils/constants";

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
    setState,
  } = useStore((state) => ({
    categorizedEvents: state.categorizedEvents,
    latestEvents: state.latestEvents,
    place: state.place,
    byDate: state.byDate,
    currentYear: state.currentYear,
    setState: state.setState,
  }));

  const [isLoading, setIsLoading] = useState(false);

  const {
    data: fetchedData = {},
    isValidating,
    error,
  } = useGetCategorizedEvents({
    props: {
      categorizedEvents: initialCategorizedEvents,
      latestEvents: initialLatestEvents,
    },
    searchTerms: SEARCH_TERMS_SUBSET,
    maxResults: MAX_RESULTS,
  });

  const categorizedEvents = Object.keys(fetchedData.categorizedEvents || {})
    .length
    ? fetchedData.categorizedEvents
    : initialCategorizedEvents;

  const latestEvents = fetchedData.latestEvents?.length
    ? fetchedData.latestEvents
    : initialLatestEvents;

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const onCategoryClick = useCallback(
    (category) => {
      setState("category", category);
      sendEventToGA("Category", category);
      scrollToTop();
    },
    [setState, scrollToTop]
  );

  // Effects
  useEffect(() => {
    const shouldLoad =
      Object.keys(categorizedEvents).length === 0 && !error && !isValidating;
    setIsLoading((prevLoading) =>
      prevLoading !== shouldLoad ? shouldLoad : prevLoading
    );
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

  // Page data
  const {
    metaTitle,
    metaDescription,
    title,
    subTitle,
    canonical,
    notFoundText,
  } =
    generatePagesData({
      currentYear: currentYear || new Date().getFullYear(),
      place,
      byDate,
    }) || {};

  // Error handling
  if (error) return <NoEventsFound title={notFoundText} />;

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
      <div className="w-full flex-col justify-center items-center sm:w-[580px] md:w-[768px] lg:w-[1024px] mt-32">
        {isLoading || isValidating ? (
          <div className="flex flex-col">
            {/* Title */}
            <div className="uppercase mb-2 px-2 animate-fast-pulse">
              <div className="w-2/3 h-5 bg-darkCorp rounded-xl"></div>
            </div>
            {/* Subtitle */}
            <div className="text-[16px] font-normal text-blackCorp text-left px-2 font-barlow animate-fast-pulse">
              <div className="w-full h-4 bg-darkCorp rounded-xl"></div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="uppercase mb-2 px-2">{title}</h1>
            <p className="text-[16px] font-normal text-blackCorp text-left px-2 font-barlow">
              {subTitle}
            </p>
          </>
        )}
        {isLoading || isValidating ? (
          <>
            {[...Array(10)].map((_, i) => (
              <CardLoading key={i} />
            ))}
          </>
        ) : (
          <div className="p-2">
            {eventKeys.length > 0 &&
              eventKeys.map((category) =>
                categorizedEvents.events[category]?.length > 0 ? (
                  <div key={category}>
                    <div className="flex justify-between mt-4 mb-2">
                      <h2 className="font-semibold">
                        {CATEGORY_NAMES_MAP[category] || category}
                      </h2>
                      <div
                        className="flex justify-between items-center cursor-pointer text-primary"
                        onClick={() => onCategoryClick(category)}
                      >
                        <div className="flex items-center">
                          Veure més
                          <ChevronRightIcon className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    <EventsHorizontalScroll
                      events={categorizedEvents.events[category]}
                    />
                  </div>
                ) : null
              )}
            {latestEvents.length > 0 && (
              <>
                <h2 className="font-semibold mt-4 mb-6">
                  Altres esdeveniments
                </h2>
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
