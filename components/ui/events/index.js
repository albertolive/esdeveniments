import { useEffect, useState } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";
import Meta from "@components/partials/seo-meta";
import { generatePagesData } from "@components/partials/generatePagesData";
import { useGetEvents } from "@components/hooks/useGetEvents";
import { generateJsonData, getRegionLabel, getTownLabel } from "@utils/helpers";
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
  const { town: townProps, byDate: byDateProps, region: regionProps } = props;

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
  const [region, setRegion] = useState(regionProps);
  const [town, setTown] = useState(townProps);
  const [byDate, setByDate] = useState(byDateProps);
  const {
    data: { events = [], currentYear, noEventsFound = false },
    error,
    isLoading,
    isValidating,
  } = useGetEvents({
    props,
    pageIndex: dateFunctions[byDate] || "all",
    maxResults: page * 10,
    q: `${town ? getTownLabel(town) : ""} ${
      region ? getRegionLabel(region) : ""
    }`,
  });

  const jsonEvents = events.map((event) => generateJsonData(event));

  useEffect(() => {
    localStorage.setItem("currentPage", page);
  }, [page]);

  useEffect(() => {
    localStorage.removeItem("currentPage");
  }, []);

  if (error) return <div>failed to load</div>;
  console.log(region, town, byDate);
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
    region,
    town,
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
        region={region}
        setRegion={setRegion}
        town={town}
        setTown={setTown}
        setByDate={setByDate}
      />
      {noEventsFound && <NoEventsFound title={notFoundText} />}
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
