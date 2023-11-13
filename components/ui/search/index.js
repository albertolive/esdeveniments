import { useCallback, useEffect, useState } from "react";
import XIcon from "@heroicons/react/solid/XIcon";
import SearchIcon from "@heroicons/react/solid/SearchIcon";

const SEARCH_TERM_KEY = "searchTerm";

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
  const [inputValue, setInputValue] = useState(searchTerm);
  const searchEvents = useCallback((term) => {
    if (term && term.length > 0) {
      sendSearchTermGA(term);
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      localStorage.setItem(SEARCH_TERM_KEY, JSON.stringify(searchTerm));
    }
  }, [searchTerm]);

  useEffect(() => {
    let storedTerm = localStorage.getItem(SEARCH_TERM_KEY);
    try {
      storedTerm =
        storedTerm && storedTerm !== "" ? JSON.parse(storedTerm) : null;
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
      if (e.key === "Enter") {
        const value = e.target.value;
        sendSearchTermGA(value);
        setSearchTerm(value);
      }
    },
    [setSearchTerm]
  );

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedChangeHandler = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      if (value.length === 0) {
        localStorage.setItem(SEARCH_TERM_KEY, JSON.stringify(""));
      } else {
        sendSearchTermGA(value);
        localStorage.setItem(SEARCH_TERM_KEY, JSON.stringify(value));
      }
    }, 1500),
    [setSearchTerm, sendSearchTermGA]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedChangeHandler(value);
  };

  const clearSearchTerm = () => {
    setSearchTerm("");
    setInputValue("");
    localStorage.setItem(SEARCH_TERM_KEY, JSON.stringify(""));
  };

  const onFocus = (e) => {
    let val = localStorage.getItem(SEARCH_TERM_KEY);
    try {
      val = JSON.parse(val);
    } catch (e) {
      console.error(e);
    }
    e.target.value = val || e.target.value;
  };

  return (
    <div className=" w-full flex justify-center px-3 sm:w-[576px] md:w-[768px] lg:w-[1024px]">
      <div className="w-full flex justify-evenly items-center">
        <input
          type="text"
          className="w-11/12 h-12 border-0 placeholder:text-bColor"
          placeholder="Cerca qualevol cosa"
          value={inputValue}
          onKeyDown={handleKeyPress}
          onChange={handleChange}
          onFocus={onFocus}
        />
        <div className="w-1/12 h-12 mr-3 flex justify-end items-center cursor-pointer">
          {inputValue.length ? (
            <XIcon
              className="h-6 w-6 text-blackCorp"
              onClick={clearSearchTerm}
            />
          ) : (
            <SearchIcon
              className="h-5 w-5 text-blackCorp"
              onClick={() => searchEvents(searchTerm)}
              aria-label="Search"
            />
          )}
        </div>
      </div>
    </div>
  );
}