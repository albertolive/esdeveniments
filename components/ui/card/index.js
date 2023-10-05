import { memo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextImage from "next/image";
import Image from "@components/ui/common/image";
import ClockIcon from "@heroicons/react/outline/ClockIcon";
import LocationMarkerIcon from "@heroicons/react/outline/LocationMarkerIcon";
import { truncateString } from "@utils/helpers";
import CardLoading from "@components/ui/cardLoading";

const AdCard = dynamic(() => import("@components/ui/adCard"), {
  loading: () => "",
  noSSR: false,
});

function Card({ event, isLoading }) {
  const { prefetch } = useRouter();

  const handlePrefetch = () => {
    prefetch(`/e/${event.slug}`);
  };

  if (isLoading) return <CardLoading />;

  if (event.isAd)
    return (
      <div className=" bg-whiteCorp overflow-hidden cursor-pointer mb-10 md:border-t-0 block visible md:hidden md:invisible">
        <AdCard event={event} />
      </div>
    );

  const { description, icon } = event.weather || {};
  const title = truncateString(event.title || "", 60);
  const location = truncateString(event.location || "");
  const subLocation = truncateString(event.subLocation || "", 45);

  return (
    <Link href={`/e/${event.slug}`} passHref prefetch={false}>
      <div
        className="flex flex-col justify-center bg-whiteCorp overflow-hidden cursor-pointer mb-10
        md:border-t-0
        "
        onMouseEnter={handlePrefetch}
        onClick={handlePrefetch}
      >
        {/* Title */}
        <div className="bg-whiteCorp h-24 flex justify-between items-center gap-2 gap-x-4">
          <div className="w-[6px] h-1/3 bg-gradient-to-r from-primary to-primarydark px-0 mx-0"></div>
          {/* Title */}
          <h2 className="w-10/12 uppercase font-semibold text-blackCorp italic">
            <Link href={`/e/${event.slug}`} passHref prefetch={false}>
              <a>{title}</a>
            </Link>
          </h2>
          {/* WeatherIcon */}
          <div className="w-2/12 flex justify-center">
            {icon && (
              <div>
                <NextImage
                  alt={description}
                  src={icon}
                  width="30px"
                  height="30px"
                />
              </div>
            )}
          </div>
        </div>
        {/* ImageEvent */}
        <div className="">
          <Image
            className=""
            title={event.title}
            date={event.formattedStart}
            location={event.location}
            image={event.imageUploaded}
            alt={event.title}
            layout="responsive"
          />
        </div>
        {/* Info */}
        {/* InfoEvent */}
        <div className="flex flex-col px-4 pt-8 gap-4">
          {/* Date */}
          <h3 className="text-blackCorp pl-1">
            {event.formattedEnd
              ? `Del ${event.formattedStart} al ${event.formattedEnd}`
              : `${event.nameDay}, ${event.formattedStart}`}
          </h3>
          {/* Location */}
          <div className="flex items-start h-full">
            <div>
              <LocationMarkerIcon className="h-6 w-6" />
            </div>
            <div className="h-full flex flex-col justify-center items-start px-2 gap-1">
              <span className="">{location}</span>
              <span className="">{subLocation}</span>
            </div>
          </div>
          {/* hour */}
          <div className="flex justify-start items-center">
            <ClockIcon className="h-6 w-6" />
            <p className="px-2">
              {event.startTime} - {event.endTime}
            </p>
          </div>
          {event.tag && <span>{event.tag}</span>}
        </div>
      </div>
    </Link>
  );
}

export default memo(Card);
