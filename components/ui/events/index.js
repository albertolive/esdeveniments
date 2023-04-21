import { useEffect } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";
import Meta from "@components/partials/seo-meta";

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
});

export default function Events({
  events,
  jsonEvents,
  metaTitle,
  metaDescription,
  title,
  subTitle,
  description,
  noEventsFound,
  byDate,
  townLabel,
  canonical,
  isLoading,
  isValidating,
  loadMore,
  page,
  setPage,
}) {
  const sendGA = () => {
    if (typeof window !== "undefined") {
      window.gtag && window.gtag("event", "load-more-events");
    }
  };

  useEffect(() => {
    localStorage.setItem("currentPage", page);
  }, [page]);

  useEffect(() => {
    localStorage.removeItem("currentPage");
  }, []);

  return (
    <>
      <Script
        id="avui-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonEvents) }}
      />
      <Meta
        title={`${metaTitle} - Què fer`}
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
      <SubMenu />
      {noEventsFound && (
        <NoEventsFound
          title={`Ho sentim, però no hi ha esdeveniments ${byDate} a ${townLabel}. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`}
        />
      )}
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
