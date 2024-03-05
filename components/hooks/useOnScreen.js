import { useEffect, useState } from "react";

function useOnScreen(ref, options = {}) {
  const { rootMargin = "0px", freezeOnceVisible = false } = options;
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) {
      return;
    }

    const frozen = isIntersecting && freezeOnceVisible;
    if (frozen) {
      return;
    }

    const updateEntry = ([entry]) => {
      setIntersecting(entry.isIntersecting);
    };

    const observerParams = {
      rootMargin,
      ...options,
    };

    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [ref, rootMargin, freezeOnceVisible, isIntersecting, options]);

  return isIntersecting;
}

export default useOnScreen;
