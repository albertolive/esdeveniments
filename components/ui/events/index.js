import { useEffect, useState } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";
import Meta from "@components/partials/seo-meta";
import { generatePagesData } from "@components/partials/generatePagesData";
import { useGetEvents } from "@components/hooks/useGetEvents";
import { generateJsonData, getPlaceTypeAndLabel } from "@utils/helpers";
import { dateFunctions } from "@utils/constants";

const NoEventsFound = dynamic(
  () => import("@components/ui/common/noEventsFound"),
  {
    loading: () => "",
  }
);

const Card = dynamic(() => import("@components/ui/card"), {
  loading: () => "",
});

const List = dynamic(() => import("@components/ui/list"), {
  loading: () => "",
});

const SubMenu = dynamic(() => import("@components/ui/common/subMenu"), {
  loading: () => "",
  noSSR: true,
});

export default function Events({ props, loadMore = true }) {
  const { place: placeProps, byDate: byDateProps } = props;

  const sendGA = () => {
    if (typeof window !== "undefined") {
      window.gtag && window.gtag("event", "load-more-events");
    }
  };

  const [page, setPage] = useState(() => {
    const storedPage =
      typeof window !== "undefined" &&
      window.localStorage.getItem("currentPage");
    return storedPage ? parseInt(storedPage) : 1;
  });
  const [place, setPlace] = useState(placeProps);
  const [byDate, setByDate] = useState(byDateProps);
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
    localStorage.removeItem("currentPage");
  }, []);

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
      <div className="reset-this">
        <h1 className="mb-4 block text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>
      </div>
      <p className="mb-4 font-bold">{subTitle}</p>
      <p className="mb-4">{description}</p>
      <SubMenu
        place={place}
        setPlace={setPlace}
        byDate={byDate}
        setByDate={setByDate}
      />
      {noEventsFound && !isLoading && <NoEventsFound title={notFoundText} />}
      {isLoading ? (
        <div class="flex justify-center items-center">
          <div class="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#ECB84A]"></div>
        </div>
      ) : (
        <List events={events}>
          {(event) => (
            <Card
              key={event.id}
              event={event}
              isLoading={isLoading}
              isValidating={isValidating}
            />
          )}
        </List>
      )}
      {!noEventsFound && loadMore && !isLoading && events.length > 7 && (
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
