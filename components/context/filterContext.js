import React, { createContext, useReducer, useContext, useEffect } from "react";
import usePersistedState from "@components/hooks/usePersistedState";

const FilterStateContext = createContext();
const FilterDispatchContext = createContext();

const initialState = {
  page: 1,
  openModal: false,
  place: "",
  byDate: "",
  category: "",
  searchTerm: "",
  userLocation: null,
  distance: "",
  scrollButton: false,
  navigatedFilterModal: false,
  categorizedEvents: {},
  latestEvents: [],
  currentYear: new Date().getFullYear(),
};

function filterReducer(state, action) {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_MODAL":
      return { ...state, openModal: action.payload };
    case "SET_PLACE":
      return { ...state, place: action.payload };
    case "SET_BYDATE":
      return { ...state, byDate: action.payload };
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_USER_LOCATION":
      return { ...state, userLocation: action.payload };
    case "SET_DISTANCE":
      return { ...state, distance: action.payload };
    case "SET_SCROLL_BUTTON":
      return { ...state, scrollButton: action.payload };
    case "SET_NAVIGATED_FILTER_MODAL":
      return { ...state, navigatedFilterModal: action.payload };
    case "SET_CATEGORIZED_EVENTS":
      return { ...state, categorizedEvents: action.payload };
    case "SET_LATEST_EVENTS":
      return { ...state, latestEvents: action.payload };
    case "SET_CURRENT_YEAR":
      return { ...state, currentYear: action.payload };
    default:
      return state;
  }
}

export function FilterProvider({ children, initialState: customInitialState }) {
  const mergedInitialState = { ...initialState, ...customInitialState };
  const [persistedState, setPersistedState] = usePersistedState(
    "filterState",
    mergedInitialState
  );
  const [state, dispatch] = useReducer(filterReducer, persistedState);

  useEffect(() => {
    setPersistedState(state);
  }, [state, setPersistedState]);

  return (
    <FilterStateContext.Provider value={state}>
      <FilterDispatchContext.Provider value={dispatch}>
        {children}
      </FilterDispatchContext.Provider>
    </FilterStateContext.Provider>
  );
}

export function useFilterState() {
  const context = useContext(FilterStateContext);
  if (context === undefined) {
    throw new Error("useFilterState must be used within a FilterProvider");
  }
  return context;
}

export function useFilterDispatch() {
  const context = useContext(FilterDispatchContext);
  if (context === undefined) {
    throw new Error("useFilterDispatch must be used within a FilterProvider");
  }
  return context;
}
