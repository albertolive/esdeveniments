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
import CardLoading from "@components/ui/cardLoading";
import { CATEGORIES } from "@utils/constants";
import Search from "@components/ui/search";
import { useScrollVisibility } from "@components/hooks/useScrollVisibility";
import Imago from "public/static/images/imago-esdeveniments.png";
import NextImage from "next/image";

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
  const [isLoading, setIsLoading] = useState(true);
  const [navigatedFilterModal, setNavigatedFilterModal] = useState(false);

  // Derived state
  const { type, label, regionLabel } = getPlaceTypeAndLabel(place);
  const categoryQuery = category ? CATEGORIES[category] : "";
  const sharedQuery = `${searchTerm} ${categoryQuery} ${label}`;
  const pageIndex = dateFunctions[byDate] || "all";
  const shuffleItems = false; //sharedQuery.trim() === "" && pageIndex === "all";
  const {
    data: { events = [], currentYear, noEventsFound = false, allEventsLoaded },
    isValidating,
    error,
  } = useGetEvents({
    props,
    pageIndex,
    maxResults: shuffleItems ? page * MAX_RESULTS : page * 10,
    q: type === "town" ? `${sharedQuery} ${regionLabel}` : sharedQuery,
    shuffleItems,
  });

  const notFound =
    !isLoading &&
    !isValidating &&
    (noEventsFound || filteredEvents.length === 0);

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
    if (!shuffleItems && !openModal && navigatedFilterModal) {
      scrollToTop();
      resetPage();
      setNavigatedFilterModal(false);
    }
  }, [shuffleItems, openModal, navigatedFilterModal]);

  useEffect(() => {
    if (distance && !openModal && navigatedFilterModal) {
      scrollToTop();
      resetPage();
    }
  }, [distance, openModal, navigatedFilterModal]);

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
    canonical,
    notFoundText,
  } =
    generatePagesData({
      currentYear,
      place: placeProps || place,
      byDate: byDateProps || byDate,
    }) || {};

  // Render
  return (
    <>
      <Script
        id={`${placeProps || "catalunya"}-${byDateProps || "all"}-script`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonEvents) }}
      />
      <Meta
        title={metaTitle}
        description={metaDescription}
        canonical={canonical}
      />
      <div
        onClick={scrollToTop}
        className={`w-14 h-14 flex justify-center items-center bg-whiteCorp rounded-md shadow-xl ${
          scrollButton
            ? "fixed z-10 bottom-28 right-10 flex justify-end animate-appear"
            : "hidden"
        }`}
      >
        <NextImage
          src={Imago}
          className="p-1"
          width="28"
          height="28"
          alt="Esdeveniments.cat"
        />
      </div>
      <div
        className={`w-full bg-whiteCorp fixed transition-all duration-500 ease-in-out ${
          isSticky
            ? "top-10 z-5"
            : "top-0 z-10 md:top-10 border-bColor md:border-b-0 shadow-sm md:shadow-none"
        }  flex justify-center items-center pt-2 `}
      >
        <div className="w-full flex flex-col justify-center items-center md:items-start mx-auto px-4 pb-2 sm:px-10 sm:w-[580px]">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <SubMenu
            place={place}
            placeProps={placeProps}
            setPlace={setPlace}
            byDate={byDate}
            byDateProps={byDateProps}
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
            setNavigatedFilterModal={setNavigatedFilterModal}
          />
        </div>
      </div>
      <div className="w-full flex-col justify-center items-center sm:px-10 sm:w-[580px] mt-24">
        {notFound && <NoEventsFound title={notFoundText} />}
        {!notFound && (
          <>
            <h1 className="leading-8 font-semibold text-blackCorp text-left uppercase italic mb-4 px-4">
              {title}
            </h1>
            <h2 className="text-[16px] font-normal text-blackCorp text-left mb-4 px-4">
              {subTitle}
            </h2>
          </>
        )}
        {(isLoading || isValidating) && !isLoadingMore ? (
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
                className="w-[120px] bg-whiteCorp flex justify-center items-center gap-2 font-barlow italic uppercase tracking-wider font-semibold p-2 border-2 border-bColor rounded-lg hover:bg-primary hover:text-whiteCorp hover:border-whiteCorp ease-in-out duration-300 focus:outline-none"
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
