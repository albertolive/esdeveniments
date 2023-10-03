import { useCallback, useEffect, useRef } from "react";
import SearchIcon from "@heroicons/react/solid/SearchIcon";

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

export default function Search({ searchTerm, setSearchTerm }) {
  const searchTermRef = useRef(searchTerm);

  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  const searchEvents = useCallback((searchInLocalStorage) => {
    const term = searchInLocalStorage || searchTermRef.current;

    if (term && term.length > 0) {
      sendSearchTermGA(term);
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      localStorage.setItem("searchTerm", JSON.stringify(searchTerm));
    }
  }, [searchTerm]);

  useEffect(() => {
    let storedTerm = localStorage.getItem("searchTerm");
    try {
      storedTerm = JSON.parse(storedTerm);
    } catch (e) {
      console.error(e);
    }

    if (storedTerm) {
      setSearchTerm(storedTerm);
      searchEvents(storedTerm);
    }
  }, [searchEvents, setSearchTerm]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") searchEvents();
    },
    [searchEvents]
  );

  const debouncedChangeHandler = useRef(
    debounce((e) => {
      const value = e.target.value;

      if (value.length === 0) {
        setSearchTerm("");
        localStorage.setItem("searchTerm", JSON.stringify(""));
      } else {
        sendSearchTermGA(value);
        setSearchTerm(value);
      }
    }, 1500)
  );

  const handleChangeWithDebounce = (e) => {
    debouncedChangeHandler.current(e);
  };

  const onFocus = (e) => {
    let val = localStorage.getItem("searchTerm");
    try {
      val = JSON.parse(val);
    } catch (e) {
      console.error(e);
    }
    e.target.value = val || e.target.value;
  };

  return (
    <div className="space-y-8 divide-y divide-gray-200 max-w-3xl mx-auto mb-4">
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="relative">
          <input
            type="text"
            className="shadow-sm focus:ring-gray-300 focus:border-gray-300 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Cerca..."
            defaultValue={searchTerm}
            onKeyDown={handleKeyPress}
            onChange={handleChangeWithDebounce}
            autoFocus
            onFocus={onFocus}
          />
          <div className="absolute top-2 right-2 cursor-pointer">
            <SearchIcon
              className="h-6 w-6 text-gray-400"
              onClick={searchEvents}
              aria-label="Search"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
