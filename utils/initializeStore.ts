import useStore from "@store";

export const initializeStore = (initialState) => {
  const initialize = useStore.getState().initializeStore;
  initialize(initialState);
};
