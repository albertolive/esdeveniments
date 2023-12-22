import { memo, useEffect, useState, useCallback } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";
import Meta from "@components/partials/seo-meta";
import { generatePagesData } from "@components/partials/generatePagesData";
import { useGetEvents } from "@components/hooks/useGetEvents";
import {
  generateJsonData,
  getDistance,
  getPlaceTypeAndLabel,
  sendEventToGA,
} from "@utils/helpers";
import { MAX_RESULTS, dateFunctions } from "@utils/constants";
import SubMenu from "@components/ui/common/subMenu";
import List from "@components/ui/list";
import Card from "@components/ui/card";
import PlusIcon from "@heroicons/react/outline/PlusIcon";
import ArrowUp from "@heroicons/react/outline/ArrowUpIcon";
import XIcon from "@heroicons/react/outline/XIcon";
import CardLoading from "@components/ui/cardLoading";
import { CATEGORIES } from "@utils/constants";
import Search from "@components/ui/search";
import { useScrollVisibility } from "@components/hooks/useScrollVisibility";

const NoEventsFound = dynamic(
  () => import("@components/ui/common/noEventsFound"),
  {
    loading: () => "",
    ssr: false,
  }
);

function Events({ props, loadMore = true }) {
  // Props destructuring
  const { place: placeProps, byDate: byDateProps } = props;

  // State
  const [page, setPage] = useState(getStoredPage);
  const [openModal, setOpenModal] = useState(false);
  const [place, setPlace] = useState("");
  const [byDate, setByDate] = useState("");
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [scrollButton, setScrollButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to false
  const [isTimeout, setIsTimeout] = useState(false); // Set initial timeout state to false

  // Derived state
  const { type, label, regionLabel } = getPlaceTypeAndLabel(place);
  const categoryQuery = category ? CATEGORIES[category] : "";
  const sharedQuery = `${searchTerm} ${categoryQuery} ${label}`;
  const pageIndex = dateFunctions[byDate] || "all";
  const shuffleItems = sharedQuery.trim() === "" && pageIndex === "all";
  const {
    data: { events = [], currentYear, noEventsFound = false, allEventsLoaded },
    isLoading: isLoadingSWR,
    isValidating,
    error,
  } = useGetEvents({
    props,
    pageIndex,
    maxResults: shuffleItems ? page * MAX_RESULTS : page * 10,
    q: type === "town" ? `${sharedQuery} ${regionLabel}` : sharedQuery,
    shuffleItems,
  });

  const jsonEvents = events
    .filter(({ isAd }) => !isAd)
    .map((event) => generateJsonData(event));

  // Event handlers
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLoadMore = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("scrollPosition", window.scrollY);
    }
    setIsLoadingMore(true);
    setPage((prevPage) => prevPage + 1);
    sendGA();
  }, []);

  const toggleDropdown = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const filterEventsByDistance = useCallback(
    (events, userLocation) => {
      if (distance === "" || isNaN(distance)) return events;

      return events.filter((event) => {
        if (event.isAd || !event.coords || !userLocation) {
          return true;
        }

        const eventDistance = getDistance(userLocation, event.coords);
        return eventDistance <= distance;
      });
    },
    [distance]
  );

  // Helper function
  const resetPage = () => {
    setPage(1);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("currentPage", "1");
    }
  };

  const isSticky = useScrollVisibility(30);

  // Effects

  useEffect(() => {
    if (!shuffleItems && !openModal) {
      scrollToTop();
    }
  }, [shuffleItems, openModal]);

  useEffect(() => {
    if (distance && !openModal) {
      scrollToTop();
    }
  }, [distance, openModal]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setScrollButton(true);
      } else if (window.scrollY < 200) {
        setScrollButton(false);
      }
    };

    // Run the function once to handle the initial scroll position
    handleScroll();

    // Add the event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Set a timeout to show the loading state after a delay
    const timeoutId = setTimeout(() => setIsTimeout(true), 1000); // 1 second delay

    // If events data is available before the timeout, clear the timeout and don't show the loading state
    if (events.length > 0) {
      clearTimeout(timeoutId);
      setIsTimeout(false);
    }

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, [events]);

  useEffect(() => {
    const storedCategory = window.localStorage.getItem("category");
    const storedPlace = window.localStorage.getItem("place");
    const storedByDate = window.localStorage.getItem("byDate");
    const storedDistance = window.localStorage.getItem("distance");

    setCategory(storedCategory || "");
    setPlace(storedPlace || "");
    setByDate(storedByDate || "");
    setDistance(Number(storedDistance) || "");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("currentPage", page);
  }, [page]);

  useEffect(() => {
    if (place) {
      window.localStorage.setItem("place", place);
      sendEventToGA("Place", place);
    }
  }, [place]);

  useEffect(() => {
    if (byDate) {
      window.localStorage.setItem("byDate", byDate);
      sendEventToGA("ByDate", byDate);
    }
  }, [byDate]);

  useEffect(() => {
    window.localStorage.setItem("category", category);
    category && sendEventToGA("Category", category);
  }, [category]);

  useEffect(() => {
    window.localStorage.setItem("distance", distance);
    if (typeof distance === "number") {
      sendEventToGA("Distance", distance);
    }
  }, [distance]);

  useEffect(() => {
    if (place !== placeProps || byDate !== byDateProps) {
      resetPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place, byDate]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.performance.navigation.type === 1) {
        window.localStorage.removeItem("scrollPosition");
      } else {
        const storedScrollPosition =
          window.localStorage.getItem("scrollPosition");
        if (storedScrollPosition) {
          window.scrollTo(0, parseInt(storedScrollPosition));
        }
      }
    }
  }, []);

  useEffect(() => {
    const storedScrollPosition =
      typeof window !== "undefined" &&
      window.localStorage.getItem("scrollPosition");
    if (storedScrollPosition) {
      window.scrollTo(0, parseInt(storedScrollPosition));
    }
  }, [events.length]);

  useEffect(() => {
    if (events.length > 0) {
      setIsLoadingMore(false);
    }
  }, [events]);

  useEffect(() => {
    setFilteredEvents(filterEventsByDistance(events, userLocation));
  }, [userLocation, events, filterEventsByDistance]);

  useEffect(() => {
    if (placeProps) {
      setPlace(placeProps);
    } else {
      const storedPlace = window.localStorage.getItem("place");
      setPlace(storedPlace === "undefined" ? undefined : storedPlace);
    }
  }, [placeProps]);

  useEffect(() => {
    if (byDateProps) {
      setByDate(byDateProps);
    } else {
      const storedByDate = window.localStorage.getItem("byDate");
      setByDate(storedByDate === "undefined" ? undefined : storedByDate);
    }
  }, [byDateProps]);

  useEffect(() => {
    setIsLoading(!events && !error);
  }, [events, error]);

  // Error handling
  if (error) return <NoEventsFound title={notFoundText} />;

  // Page data
  const {
    metaTitle,
    metaDescription,
    title,
    subTitle,
    description,
    canonical,
    notFoundText,
  } =
    generatePagesData({
      currentYear,
      place,
      byDate,
    }) || {};

  // Render
  return (
    <>
      <Script
        id="avui-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonEvents) }}
      />
      <Meta
        title={`${metaTitle} - Esdeveniments.cat`}
        description={`${metaDescription}`}
        canonical={canonical}
      />
      <div
        onClick={scrollToTop}
        className={`w-8 h-8 text-whiteCorp bg-primary flex justify-center items-center rounded-lg shadow-xl ${
          scrollButton
            ? "fixed z-10 bottom-[82px] md:bottom-[90px] lg:bottom-[90px] right-8 flex justify-end animate-appear"
            : "hidden"
        }`}
      >
        <ArrowUp className="w-5 h-5" aria-hidden="true" />
      </div>
      <div
        className={`w-full bg-whiteCorp fixed transition-all duration-500 ease-in-out ${
          isSticky ? "top-10" : "top-0 md:top-10"
        } z-10 flex justify-center items-center pt-2`}
      >
        <div className="w-full flex flex-col justify-center items-center md:items-start mx-auto px-4 sm:px-10 sm:w-[580px]">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <SubMenu
            place={place}
            setPlace={setPlace}
            byDate={byDate}
            setByDate={setByDate}
            category={category}
            setCategory={setCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            userLocation={userLocation}
            setUserLocation={setUserLocation}
            distance={distance}
            setDistance={setDistance}
            openModal={openModal}
            setOpenModal={setOpenModal}
            scrollToTop={scrollToTop}
          />
        </div>
      </div>
      <div className="w-full flex-col justify-center items-center sm:px-10 sm:w-[580px]">
        <div className="mt-4">
          <div className="p-2 flex flex-col justify-center items-center invisible">
            <button
              onClick={toggleDropdown}
              className={`w-11/12 py-4 flex justify-start items-center gap-1 text-blackCorp focus:outline-none`}
            >
              {open ? (
                <p className="w-24 text-center">Tancar</p>
              ) : (
                <p className="w-24 text-center">Informació</p>
              )}
              {open ? (
                <XIcon className="h-4 w-4" />
              ) : (
                <PlusIcon className="h-4 w-4" />
              )}
            </button>
            {open && (
              <div className="flex flex-col gap-4 py-4 border-t border-darkCorp">
                <div>
                  <h1 className="leading-8 font-semibold text-blackCorp text-center md:text-left uppercase italic">
                    {title}
                  </h1>
                </div>
                <div className="px-2 flex flex-col justify-center items-center gap-4 lg:justify-center lg:items-start lg:gap-x-8 lg:mx-20 lg:flex lg:flex-row">
                  <p className="w-full text-center md:text-left lg:w-1/2">
                    {subTitle}
                  </p>
                  <div className="w-1/2 border-b border-darkCorp lg:hidden"></div>
                  <p className="w-full text-center md:text-left lg:w-1/2">
                    {description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {(noEventsFound || filteredEvents.length === 0) && !isLoading && (
          <NoEventsFound title={notFoundText} />
        )}
        {isLoading && !isLoadingMore ? (
          <div>
            {[...Array(10)].map((_, i) => (
              <CardLoading key={i} />
            ))}
          </div>
        ) : (
          <List events={filteredEvents}>
            {(event) => <Card key={event.id} event={event} />}
          </List>
        )}
        {isLoadingMore && <CardLoading />}
        {!noEventsFound &&
          loadMore &&
          filteredEvents.length > 7 &&
          !isLoadingMore &&
          !allEventsLoaded && (
            <div className="h-12 flex justify-center items-center text-center pt-10 pb-14">
              <button
                type="button"
                className="w-[120px] bg-whiteCorp flex justify-center items-center gap-2 font-barlow italic uppercase tracking-wider font-medium p-2 border-2 border-bColor rounded-lg hover:bg-primary hover:text-whiteCorp hover:border-whiteCorp ease-in-out duration-300 focus:outline-none"
                onClick={handleLoadMore}
              >
                Carregar més
              </button>
            </div>
          )}
      </div>
    </>
  );
}

export default memo(Events);

// Helper functions
function getStoredPage() {
  const storedPage =
    typeof window !== "undefined" && window.localStorage.getItem("currentPage");
  return storedPage ? parseInt(storedPage) : 1;
}

function sendGA() {
  if (typeof window !== "undefined") {
    window.gtag && window.gtag("event", "load-more-events");
  }
}
