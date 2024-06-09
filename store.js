import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => ({
      // State properties
      page: 1,
      openModal: false,
      place: "",
      byDate: "",
      category: "",
      searchTerm: "",
      userLocation: null,
      distance: "",
      categorizedEvents: {},
      latestEvents: [],
      events: [],
      currentYear: new Date().getFullYear(),
      scrollPosition: 0,
      filtersApplied: false,

      // State update method
      setState: (key, value) => set(() => ({ [key]: value })),

      // Initialization method
      initializeStore: (initialState) => set(initialState),

      // Check active filters
      areFiltersActive: () => {
        const state = get();

        return (
          Boolean(state.place) ||
          Boolean(state.byDate) ||
          Boolean(state.category) ||
          Boolean(state.searchTerm) ||
          Boolean(state.distance)
        );
      },
    }),
    {
      name: "filterState",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        page: state.page,
        place: state.place,
        byDate: state.byDate,
        category: state.category,
        searchTerm: state.searchTerm,
        userLocation: state.userLocation,
        distance: state.distance,
        currentYear: state.currentYear,
        scrollPosition: state.scrollPosition,
      }),
    }
  )
);

export default useStore;
