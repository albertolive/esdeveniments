import { useState, useEffect } from "react";

export const useScrollVisibility = (scrollThreshold) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= scrollThreshold && isVisible) {
        setIsVisible(false);
      } else if (window.scrollY < scrollThreshold && !isVisible) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isVisible, scrollThreshold]);

  return isVisible;
};
