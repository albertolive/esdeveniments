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
      <div className="reset-this mx-10">
        <h1 className="mb-2 block leading-8 tracking-wide font-normal text-secondary text-center">
          {title}
        </h1>
      </div>
      <div className="md:m-full md:mx-20 md:flex md:flex-row md:justify-center md:items-start md:gap-x-8
      mx-10 flex flex-col justify-center">
        <p className="my-4 m-full text-center font-bold md:m-1/2 md:text-justify md:">{subTitle}</p>
        <div className="mx-20 border-b border-secondary md:hidden"></div>
        <p className="my-4 m-full text-center md:m-1/2 md:text-left">{description}</p>
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
            className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-[#ECB84A] hover:bg-yellow-400 focus:outline-none"
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
