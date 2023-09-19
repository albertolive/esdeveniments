import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";
import Meta from "@components/partials/seo-meta";
import { generatePagesData } from "@components/partials/generatePagesData";
import { useGetEvents } from "@components/hooks/useGetEvents";
import { generateJsonData, getPlaceTypeAndLabel } from "@utils/helpers";
import { dateFunctions } from "@utils/constants";
import CardLoading from "@components/ui/cardLoading";
import { SubMenu } from "@components/ui/common";
import List from "@components/ui/list";
import Card from "@components/ui/card";
import ChevronDownIcon from "@heroicons/react/outline/ChevronDownIcon";
import XIcon from "@heroicons/react/outline/XIcon";

const NoEventsFound = dynamic(
  () => import("@components/ui/common/noEventsFound"),
  {
    loading: () => "",
  }
);

const LoadingSpinner = dynamic(() => import("@components/ui/common/loading"), {
  loading: () => "",
});

export default function Events({ props, loadMore = true }) {
  // Refs
  const scrollPosition = useRef(0);

  // Props destructuring
  const { place: placeProps, byDate: byDateProps } = props;

  // State
  const [page, setPage] = useState(getStoredPage);
  const [place, setPlace] = useState(() => getStoredPlace(placeProps));
  const [byDate, setByDate] = useState(() => getStoredByDate(byDateProps));
  const [open, setOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Derived state
  const { type, label, regionLabel } = getPlaceTypeAndLabel(place);
  const {
    data: { events = [], currentYear, noEventsFound = false },
    error,
    isLoading,
  } = useGetEvents({
    props,
    pageIndex: dateFunctions[byDate] || "all",
    maxResults: page * 10,
    q: type === "town" ? `${label} ${regionLabel}` : label,
  });
  const jsonEvents = events.map((event) => generateJsonData(event));

  // Event handlers
  const handleLoadMore = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("scrollPosition", window.scrollY);
    }
    setIsLoadingMore(true);
    setPage((prevPage) => prevPage + 1);
    sendGA();
  };
  const toggleDropdown = () => {
    setOpen(!open);
  };

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
  }, [page]);

  useEffect(() => {
    localStorage.setItem("place", place);
  }, [place]);

  useEffect(() => {
    localStorage.setItem("byDate", byDate);
  }, [byDate]);

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
  }, [events]);

  useEffect(() => {
    if (events.length > 0) {
      setIsLoadingMore(false);
    }
  }, [events]);

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
      <div className="p-2 flex flex-col justify-center items-center">
        <button
          onClick={toggleDropdown}
          className={`w-11/12 p-3 flex justify-center items-center gap-4 font-semibold text-blackCorp focus:outline-none`}
        >
          {open ? <p className="w-24 text-center tracking-wide">Tancar</p> : <p className="w-24 text-center tracking-wide">Informació</p>}
          {open ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <ChevronDownIcon className="h-6 w-6" />
          )}
        </button>
        {open && (
          <div className="flex flex-col pt-8 border-t border-darkCorp">
            <div className="mx-10">
              <h1
                className="mb-2 leading-8 font-semibold text-blackCorp text-center
              md:text-left"
              >
                {title}
              </h1>
            </div>
            <div className="mx-10 flex flex-col justify-center items-center
            lg:justify-center lg:items-start lg:gap-x-8 lg:mx-20 lg:flex lg:flex-row">
              <p
                className="my-4 w-full text-center
              md:text-left
              lg:w-1/2"
              >
                {subTitle}
              </p>
              <div className="w-1/2 border-b border-darkCorp lg:hidden"></div>
              <p
                className="my-4 w-full text-center
              md:text-left
              lg:w-1/2"
              >
                {description}
              </p>
            </div>
          </div>
        )}
      </div>
      <SubMenu
        place={place}
        setPlace={setPlace}
        byDate={byDate}
        setByDate={setByDate}
      />
      {noEventsFound && !isLoading && <NoEventsFound title={notFoundText} />}
      {isLoading && !isLoadingMore ? (
        <div>
          {[...Array(10)].map((_, i) => (
            <CardLoading key={i} />
          ))}
        </div>
      ) : (
        <List events={events}>
          {(event) => <Card key={event.id} event={event} />}
        </List>
      )}
      {isLoadingMore && <LoadingSpinner />}
      {!noEventsFound && loadMore && events.length > 7 && !isLoadingMore && (
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
    </>
  );
}

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
