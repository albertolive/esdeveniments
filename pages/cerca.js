import { useCallback, useEffect, useState } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";
import { generateJsonData } from "@utils/helpers";
import SearchIcon from "@heroicons/react/solid/SearchIcon";
import XIcon from "@heroicons/react/solid/XIcon";
import { useGetEvents } from "@components/hooks/useGetEvents";
import Card from "@components/ui/card";
import List from "@components/ui/list";
import Meta from "@components/partials/seo-meta";

const NoEventsFound = dynamic(
  () => import("@components/ui/common/noEventsFound"),
  {
    loading: () => "",
  }
);

function debounce(func, wait, immediate) {
  let timeout;

  return function executedFunction() {
    const context = this;
    const args = arguments;

    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

const SearchResults = ({ keyword }) => {
  const {
    data: { events = [], noEventsFound = false },
    error,
    isLoading,
    isValidating,
  } = useGetEvents({ pageIndex: "search", q: keyword, refreshInterval: false });

  if (error) return <div className="">failed to load</div>;

  const jsonData = events
    .filter(({ isAd }) => !isAd)
    .map((event) => generateJsonData(event));

  return (
    <>
      <Script
        id="cerca-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonData) }}
      />
      {noEventsFound && !isLoading && (
        <NoEventsFound title="Res ha coincidit amb la teva cerca, però pot ser que t'agradin aquestes altres opcions." />
      )}
      <List events={events}>
        {(event) => (
          <Card
            key={event.id}
            event={event}
            isLoading={isLoading}
            isValidating={isValidating}
          />
        )}
      </List>
    </>
  );
};

const sendSearchTermGA = (searchTerm) => {
  if (typeof window !== "undefined") {
    window.gtag &&
      window.gtag("event", "search", {
        event_category: "search",
        event_label: searchTerm,
        search_term: searchTerm,
        value: searchTerm,
      });
  }
};

export default function Search() {
  const [startFetching, setStartFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const searchEvents = useCallback(
    (searchInLocalStorage) => {
      if (
        (searchInLocalStorage && searchInLocalStorage.length > 0) ||
        searchTerm.length > 0
      ) {
        setStartFetching(true);
        sendSearchTermGA(searchInLocalStorage || searchTerm);
      }
    },
    [searchTerm]
  );

  useEffect(() => {
    if (searchTerm.length > 0) {
      localStorage.setItem("searchTerm", JSON.stringify(searchTerm));
    }
  }, [searchTerm]);

  useEffect(() => {
    const searchTerm = JSON.parse(localStorage.getItem("searchTerm"));

    if (searchTerm) {
      setSearchTerm(searchTerm);
      searchEvents(searchTerm);
    }
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") searchEvents();
  };

  const handleChange = (e) => {
    const value = e.target.value;

    value.length === 0 ? setStartFetching(false) : setSearchTerm(value);
  };

  const handleChangeWithDebounce = debounce((e) => {
    const value = e.target.value;

    if (value.length === 0) {
      setSearchTerm("");
      localStorage.setItem("searchTerm", JSON.stringify(""));
      setStartFetching(false);
    } else {
      sendSearchTermGA(value);
      setSearchTerm(value);
    }
  }, 1500);

  const onFocus = (e) => {
    const val =
      JSON.parse(localStorage.getItem("searchTerm")) || e.target.value;
    e.target.value = "";
    e.target.value = val;
  };

  const clearSearchTerm = () => setSearchTerm("");

  return (
    <>
      <Meta
        title="Cerca - Esdeveniments.cat"
        description="Cerca esdeveniments. Cultura i esdeveniments. Esdeveniments.cat"
        canonical="https://www.esdeveniments.cat/cerca"
      />
      <div className="flex justify-center items-start h-full">
        <div className="">
          <div className="flex justify-center z-10 fixed top-26 left-4 w-2/3">
            <input
              type="text"
              className="shadow-sm focus:ring-gray-300 focus:border-gray-300 w-full sm:text-sm border-gray-300 rounded-xl"
              placeholder="Cerca..."
              defaultValue={searchTerm}
              onChange={startFetching ? handleChangeWithDebounce : handleChange}
              onKeyPress={handleKeyPress}
              autoFocus
              onFocus={onFocus}
            />

            {false && (
              <div className="absolute top-3 right-10 cursor-pointer">
                <XIcon
                  className="h-4 w-4 text-gray-400"
                  onClick={clearSearchTerm}
                />
              </div>
            )}
            <div className="absolute top-2 right-2 cursor-pointer">
              <SearchIcon
                className="h-6 w-6 text-gray-400"
                onClick={searchEvents}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="pt-8">
        {startFetching && <SearchResults keyword={searchTerm} />}
      </div>
    </>
  );
}
