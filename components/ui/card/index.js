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
      <div className=" bg-whiteCorp overflow-hidden cursor-pointer mb-2 md:border-t-0 block visible md:hidden md:invisible">
        <AdCard event={event} />
      </div>
    );

  const { description, icon } = event.weather || {};
  const title = truncateString(event.title || "", 60);
  const location = truncateString(event.location || "");
  const subLocation = truncateString(event.subLocation || "", 45);

  return (
    <Link href={`/e/${event.slug}`} passHref prefetch={false} legacyBehavior>
      <div
        className="flex flex-col justify-center bg-whiteCorp overflow-hidden cursor-pointer mb-10"
        onMouseEnter={handlePrefetch}
        onClick={handlePrefetch}
      >
        {/* Title */}
        <div className="bg-whiteCorp h-fit flex justify-between items-start gap-3">
          <div className="flex justify-start items-center gap-0 pt-[2px] m-0">
            <div className="w-2 h-6 bg-gradient-to-r from-primary to-primarydark"></div>
          </div>
          {/* Title */}
          <h2 className="w-10/12 uppercase text-blackCorp italic">
            <Link href={`/e/${event.slug}`} passHref prefetch={false}>
              {title}
            </Link>
          </h2>
          {/* WeatherIcon */}
          <div className="w-2/12 flex justify-center">
            {icon && (
              <div>
                <NextImage
                  alt={description}
                  src={icon}
                  width="30"
                  height="30"
                  style={{
                    maxWidth: "100%",
                    height: "auto"
                  }} />
              </div>
            )}
          </div>
        </div>
        {/* ImageEvent */}
        <div className="p-4 flex justify-center items-center">
          <Image
            className="object-contain"
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
        <div className="flex flex-col px-4 pt-4 gap-4">
          {/* Date */}
          <h3 className="text-blackCorp uppercase italic pl-1">
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
              <span>{location}</span>
              <span>{subLocation}</span>
            </div>
          </div>
          {/* hour */}
          <div className="flex justify-start items-center">
            <ClockIcon className="h-6 w-6" />
            <p className="px-2">
              {event.isFullDayEvent
                ? "Consultar horaris"
                : `${event.startTime} - ${event.endTime}`}
            </p>
          </div>
          {event.tag && <span>{event.tag}</span>}
        </div>
      </div>
    </Link>
  );
}

export default memo(Card);
