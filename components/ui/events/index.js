import { memo, useEffect, useState, lazy, useMemo } from "react";
import NextImage from "next/image";
import { useScrollVisibility } from "@components/hooks/useScrollVisibility";
import Search from "@components/ui/search";
import SubMenu from "@components/ui/common/subMenu";
import Imago from "public/static/images/imago-esdeveniments.png";
import { useFilters } from "@components/hooks/useFilters";
import dynamic from "next/dynamic";

const EventsList = dynamic(() => import("@components/ui/eventsList"), {
  loading: () => <p>Loading...</p>,
});
const EventsCategorized = dynamic(
  () => import("@components/ui/eventsCategorized"),
  {
    loading: () => <p>Loading...</p>,
  }
);

function Events() {
  const {
    state,
    setFilter,
    resetPage,
    areFiltersActive,
    setPlace,
    setByDate,
    setCategory,
    setSearchTerm,
    setDistance,
  } = useFilters();
  const isSticky = useScrollVisibility(30);
  const isBrowser = typeof window !== "undefined";

  const [isMounted, setIsMounted] = useState(false);
  console.log("Events");
  useEffect(() => {
    setIsMounted(true);
    if (isBrowser) {
      const storedPlace = window.localStorage.getItem("place");
      const storedByDate = window.localStorage.getItem("byDate");
      const storedCategory = window.localStorage.getItem("category");
      const storedSearchTerm = window.localStorage.getItem("searchTerm");
      const storedDistance = window.localStorage.getItem("distance");

      if (storedPlace) setPlace(storedPlace);
      if (storedByDate) setByDate(storedByDate);
      if (storedCategory) setCategory(storedCategory);
      if (storedSearchTerm) setSearchTerm(storedSearchTerm);
      if (storedDistance) setDistance(storedDistance);
    }
  }, [isBrowser, setPlace, setByDate, setCategory, setSearchTerm, setDistance]);

  const hasFilters = useMemo(() => areFiltersActive(), [areFiltersActive]);

  useEffect(() => {
    if (isBrowser && !state.openModal && state.navigatedFilterModal) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      resetPage();
      setFilter("SET_NAVIGATED_FILTER_MODAL", false);
    }
  }, [
    isBrowser,
    state.openModal,
    state.navigatedFilterModal,
    resetPage,
    setFilter,
  ]);

  useEffect(() => {
    if (isBrowser) {
      const handleScroll = () => {
        setFilter("SET_SCROLL_BUTTON", window.scrollY > 400);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isBrowser, setFilter]);

  return (
    <>
      <div
        onClick={() =>
          isBrowser && window.scrollTo({ top: 0, behavior: "smooth" })
        }
        className={`w-14 h-14 flex justify-center items-center bg-whiteCorp rounded-md shadow-xl ${
          state.scrollButton
            ? "fixed z-10 bottom-28 right-10 flex justify-end animate-appear"
            : "hidden"
        }`}
      >
        <NextImage
          src={Imago}
          className="p-1"
          width="28"
          height="28"
          alt="Esdeveniments.cat"
        />
      </div>
      <div
        className={`w-full bg-whiteCorp fixed transition-all duration-500 ease-in-out ${
          isSticky
            ? "top-10 z-5"
            : "top-0 z-10 md:top-10 border-bColor md:border-b-0 shadow-sm md:shadow-none"
        } flex justify-center items-center pt-2`}
      >
        <div className="w-full flex flex-col justify-center items-center md:items-start mx-auto px-4 pb-2 sm:px-10 sm:w-[580px]">
          <Search
            searchTerm={state.searchTerm}
            setSearchTerm={(value) => setFilter("SET_SEARCHTERM", value)}
          />
          {isMounted && <SubMenu />}
        </div>
      </div>
      {isMounted && <>{hasFilters ? <EventsList /> : <EventsCategorized />}</>}
    </>
  );
}

export default memo(Events);
