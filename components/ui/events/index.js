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
} from "@utils/helpers";
import { dateFunctions } from "@utils/constants";
import { SubMenu } from "@components/ui/common";
import List from "@components/ui/list";
import Card from "@components/ui/card";
import ChevronDownIcon from "@heroicons/react/outline/ChevronDownIcon";
import XIcon from "@heroicons/react/outline/XIcon";
import CardLoading from "@components/ui/cardLoading";
import { CATEGORIES } from "@utils/constants";
import Search from "@components/ui/search";

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
  const [place, setPlace] = useState(() => getStoredPlace(placeProps));
  const [byDate, setByDate] = useState(() => getStoredByDate(byDateProps));
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Derived state
  const { type, label, regionLabel } = getPlaceTypeAndLabel(place);
  const categoryQuery = category ? CATEGORIES[category] : "";
  const sharedQuery = `${searchTerm} ${categoryQuery} ${label}`;
  const {
    data: { events = [], currentYear, noEventsFound = false },
    error,
    isLoading,
  } = useGetEvents({
    props,
    pageIndex: dateFunctions[byDate] || "all",
    maxResults: page * 10,
    q: type === "town" ? `${sharedQuery} ${regionLabel}` : sharedQuery,
  });

  const jsonEvents = events
    .filter(({ isAd }) => !isAd)
    .map((event) => generateJsonData(event));

  // Event handlers
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

  // Effects
  useEffect(() => {
    localStorage.setItem("currentPage", page);
    localStorage.setItem("place", place);
    localStorage.setItem("byDate", byDate);
  }, [page, place, byDate]);

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
  } = generatePagesData({
    currentYear,
    place,
    byDate,
  });

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
      <div className="w-full display flex justify-center items-center fixed top-18 z-10 bg-whiteCorp mx-auto px-0 sm:px-0 sm:w-[576px] md:px-4 md:w-[768px] lg:px-20 lg:w-[1024px]">
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className="pt-14">
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
        />
        <div className="p-2 flex flex-col justify-center items-center">
          <button
            onClick={toggleDropdown}
            className={`w-11/12 p-3 flex justify-center items-center gap-2 text-blackCorp focus:outline-none`}
          >
            {open ? (
              <h2 className="w-24 text-center text-[20px] uppercase italic font-medium">
                Tancar
              </h2>
            ) : (
              <h2 className="w-24 text-center text-[20px] uppercase italic font-medium">
                Informació
              </h2>
            )}
            {open ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
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
        {noEventsFound && !isLoading && <NoEventsFound title={notFoundText} />}
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
          !isLoadingMore && (
            <div className=" text-center py-10">
              <button
                type="button"
                className="text-whiteCorp bg-primary rounded-xl py-3 px-6 ease-in-out duration-300 border border-whiteCorp focus:outline-none font-barlow italic uppercase font-semibold"
                onClick={handleLoadMore}
              >
                <span className="text-white text-base font-semibold px-4">
                  Carregar més
                </span>
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

function getStoredPlace(placeProps) {
  const storedPlace =
    typeof window !== "undefined" && window.localStorage.getItem("place");
  return storedPlace === "undefined" ? undefined : storedPlace || placeProps;
}

function getStoredByDate(byDateProps) {
  const storedByDate =
    typeof window !== "undefined" && window.localStorage.getItem("byDate");
  return storedByDate === "undefined" ? undefined : storedByDate || byDateProps;
}

function sendGA() {
  if (typeof window !== "undefined") {
    window.gtag && window.gtag("event", "load-more-events");
  }
}
