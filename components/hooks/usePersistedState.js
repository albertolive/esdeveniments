import { useState, useEffect } from "react";

function usePersistedState(key, defaultValue, excludeKeys = []) {
  const [state, setState] = useState(() => {
    if (typeof window !== "undefined") {
      const persistedState = window.localStorage.getItem(key);
      if (persistedState !== null) {
        const parsedState = JSON.parse(persistedState);
        excludeKeys.forEach((key) => delete parsedState[key]);
        return { ...defaultValue, ...parsedState };
      }
    }
    return defaultValue;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stateToPersist = { ...state };
      excludeKeys.forEach((key) => delete stateToPersist[key]);
      window.localStorage.setItem(key, JSON.stringify(stateToPersist));
    }
  }, [key, state, excludeKeys]);

  return [state, setState];
}

export default usePersistedState;
