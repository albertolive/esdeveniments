import { useCallback } from "react";
import {
  useFilterState,
  useFilterDispatch,
} from "@components/context/filterContext";
import { sendEventToGA } from "@utils/helpers";

export function useFilters() {
  const state = useFilterState();
  const dispatch = useFilterDispatch();

  const setFilter = useCallback(
    (type, payload) => {
      dispatch({ type, payload });
      if (type === "SET_PLACE") {
        sendEventToGA("Place", payload);
      }
      if (type === "SET_BYDATE") {
        sendEventToGA("ByDate", payload);
      }
      if (type === "SET_CATEGORY") {
        sendEventToGA("Category", payload);
      }
      if (type === "SET_DISTANCE") {
        sendEventToGA("Distance", payload);
      }
    },
    [dispatch]
  );

  const resetPage = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("currentPage", "1");
    }
    dispatch({ type: "SET_PAGE", payload: 1 });
  }, [dispatch]);

  const areFiltersActive = useCallback(() => {
    return (
      Boolean(state.place) ||
      Boolean(state.byDate) ||
      Boolean(state.category) ||
      Boolean(state.searchTerm) ||
      Boolean(state.distance)
    );
  }, [state]);

  const setOpenModal = useCallback(
    (value) => {
      dispatch({ type: "SET_MODAL", payload: value });
    },
    [dispatch]
  );

  const setPlace = useCallback(
    (value) => {
      dispatch({ type: "SET_PLACE", payload: value });
    },
    [dispatch]
  );

  const setByDate = useCallback(
    (value) => {
      dispatch({ type: "SET_BYDATE", payload: value });
    },
    [dispatch]
  );

  const setCategory = useCallback(
    (value) => {
      dispatch({ type: "SET_CATEGORY", payload: value });
    },
    [dispatch]
  );

  const setSearchTerm = useCallback(
    (value) => {
      dispatch({ type: "SET_SEARCH_TERM", payload: value });
    },
    [dispatch]
  );

  const setUserLocation = useCallback(
    (value) => {
      dispatch({ type: "SET_USER_LOCATION", payload: value });
    },
    [dispatch]
  );

  const setDistance = useCallback(
    (value) => {
      dispatch({ type: "SET_DISTANCE", payload: value });
    },
    [dispatch]
  );

  const setScrollButton = useCallback(
    (value) => {
      dispatch({ type: "SET_SCROLL_BUTTON", payload: value });
    },
    [dispatch]
  );

  const setNavigatedFilterModal = useCallback(
    (value) => {
      dispatch({ type: "SET_NAVIGATED_FILTER_MODAL", payload: value });
    },
    [dispatch]
  );

  const setCategorizedEvents = useCallback(
    (value) => {
      dispatch({ type: "SET_CATEGORIZED_EVENTS", payload: value });
    },
    [dispatch]
  );

  const setLatestEvents = useCallback(
    (value) => {
      dispatch({ type: "SET_LATEST_EVENTS", payload: value });
    },
    [dispatch]
  );

  const setCurrentYear = useCallback(
    (value) => {
      dispatch({ type: "SET_CURRENT_YEAR", payload: value });
    },
    [dispatch]
  );

  return {
    state,
    setFilter,
    resetPage,
    areFiltersActive,
    setOpenModal,
    setPlace,
    setByDate,
    setCategory,
    setSearchTerm,
    setUserLocation,
    setDistance,
    setScrollButton,
    setNavigatedFilterModal,
    setCategorizedEvents,
    setLatestEvents,
    setCurrentYear,
  };
}
