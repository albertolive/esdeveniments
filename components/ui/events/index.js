import { useEffect, useState } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";
import Meta from "@components/partials/seo-meta";
import { generatePagesData } from "@components/partials/generatePagesData";
import { useGetEvents } from "@components/hooks/useGetEvents";
import { generateJsonData, getPlaceTypeAndLabel } from "@utils/helpers";
import { dateFunctions } from "@utils/constants";
import CardLoading from "@components/ui/cardLoading";
import { SubMenu } from "@components/ui/common";
import List from "@components/ui/list";
import Card from "@components/ui/card";

const NoEventsFound = dynamic(
  () => import("@components/ui/common/noEventsFound"),
  {
    loading: () => "",
  }
);

export default function Events({ props, loadMore = true }) {
  const { place: placeProps, byDate: byDateProps } = props;

  const sendGA = () => {
    if (typeof window !== "undefined") {
      window.gtag && window.gtag("event", "load-more-events");
    }
  };

  const [scrollPosition, setScrollPosition] = useState(0);

  const [page, setPage] = useState(() => {
    const storedPage =
      typeof window !== "undefined" &&
      window.localStorage.getItem("currentPage");
    return storedPage ? parseInt(storedPage) : 1;
  });

  const [place, setPlace] = useState(() => {
    const storedPlace =
      typeof window !== "undefined" && window.localStorage.getItem("place");
    return storedPlace === "undefined" ? undefined : storedPlace || placeProps;
  });

  const [byDate, setByDate] = useState(() => {
    const storedByDate =
      typeof window !== "undefined" && window.localStorage.getItem("byDate");
    return storedByDate === "undefined"
      ? undefined
      : storedByDate || byDateProps;
  });

  const [open, setOpen] = useState(false);

  const { type, label, regionLabel } = getPlaceTypeAndLabel(place);
  const {
    data: { events = [], currentYear, noEventsFound = false },
    error,
    isLoading,
    isValidating,
  } = useGetEvents({
    props,
    pageIndex: dateFunctions[byDate] || "all",
    maxResults: page * 10,
    q: type === "town" ? `${label} ${regionLabel}` : label,
  });

  const jsonEvents = events.map((event) => generateJsonData(event));

  useEffect(() => {
    localStorage.setItem("currentPage", page);
  }, [page]);

  useEffect(() => {
    localStorage.setItem("place", place);
  }, [place]);

  useEffect(() => {
    localStorage.setItem("byDate", byDate);
  }, [byDate]);

  useEffect(() => {
    // Only reset the page state and localStorage value if place or byDate has changed
    if (place !== placeProps || byDate !== byDateProps) {
      setPage(1);

      if (typeof window !== "undefined") {
        window.localStorage.setItem("currentPage", "1");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place, byDate]);

  useEffect(() => {
    setScrollPosition(window.scrollY);
  }, [events]);

  useEffect(() => {
    window.scrollTo(0, scrollPosition);
  }, [scrollPosition]);

  if (error) return <div>failed to load</div>;

  const {
    metaTitle,
    metaDescription,
    title,
    subTitle,
    description,
    canonical,
    notFoundText,
  } = generatePagesData({
    currentYear,
    place,
    byDate,
  });

  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <>
      <Script
        id="avui-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonEvents) }}
      />
      <Meta
        title={`${metaTitle} - Esdeveniments.cat`}
        description={`${metaDescription}`}
        canonical={canonical}
      />
      <div className="flex flex-col justify-center items-center">
        <button
          onClick={toggleDropdown}
          className="w-content p-3 font-semibold text-blackCorp rounded-lg border border-darkCorp bg-whiteCorp focus:outline-none
          transition-colors ${
            open 
              ? 'bg-primary text-whiteCorp'
              : 'bg-whiteCorp text-blackCorp md:hover:bg-primary'
          }"
        >
          {open ? "Tancar" : "Informació"}
        </button>
        {open && (
          <div className="mt-4">
            <div className="mx-10">
              <h1 className="mb-2 block leading-8 tracking-normal font font-semibold text-blackCorp text-center">
                {title}
              </h1>
            </div>
            <div
              className="lg:m-full lg:mx-20 lg:flex lg:flex-row lg:justify-center lg:items-start lg:gap-x-8
      mx-10 flex flex-col justify-center"
            >
              <p className="my-4 m-full text-center font-semibold lg:m-1/2">
                {subTitle}
              </p>
              <div className="mx-40 border-b border-blackCorp lg:hidden"></div>
              <p className="my-4 m-full text-center lg:m-1/2">{description}</p>
            </div>
          </div>
        )}
      </div>
      <SubMenu
        place={place}
        setPlace={setPlace}
        byDate={byDate}
        setByDate={setByDate}
      />
      {noEventsFound && !isLoading && <NoEventsFound title={notFoundText} />}
      {isLoading || isValidating ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {[...Array(10)].map((_, i) => (
            <CardLoading key={i} />
          ))}
        </div>
      ) : (
        <List events={events}>
          {(event) => <Card key={event.id} event={event} />}
        </List>
      )}
      {!noEventsFound && loadMore && events.length > 7 && (
        <div className="text-center">
          <button
            type="button"
            className="text-whiteCorp bg-primary rounded-xl py-3 px-3 ease-in-out duration-200 border border-whiteCorp focus:outline-none"
            onClick={() => {
              setPage((prevPage) => prevPage + 1);
              sendGA();
            }}
          >
            <span className="text-white">Carregar més</span>
          </button>
        </div>
      )}
    </>
  );
}
