import { memo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextImage from "next/image";
import Image from "@components/ui/common/image";
import ClockIcon from "@heroicons/react/outline/ClockIcon";
import LocationMarkerIcon from "@heroicons/react/outline/LocationMarkerIcon";
import CalendarIcon from "@heroicons/react/outline/CalendarIcon";
import ShareIcon from "@heroicons/react/outline/ShareIcon";
import { truncateString } from "@utils/helpers";
import CardLoading from "@components/ui/cardLoading";
import ShareButton from "@components/ui/common/cardShareButton";
import ViewCounter from "@components/ui/viewCounter";

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
    <>
      <Link href={`/e/${event.slug}`} passHref prefetch={false} legacyBehavior>
        <div
          className="w-full flex flex-col justify-center bg-whiteCorp overflow-hidden cursor-pointer"
          onMouseEnter={handlePrefetch}
          onClick={handlePrefetch}
        >
          {/* Title */}
          <div className="bg-whiteCorp h-fit flex justify-between items-start gap-2 pr-4">
            <div className="flex justify-start items-center gap-0 pt-[2px] m-0">
              <div className="w-2 h-6 bg-gradient-to-r from-primary to-primarydark"></div>
            </div>
            {/* Title */}
            <h3 className="w-11/12 uppercase italic">
              <Link href={`/e/${event.slug}`} passHref prefetch={false}>
                {title}
              </Link>
            </h3>
            {/* WeatherIcon */}
            <div className="w-1/12 flex justify-end">
              {icon && (
                <div>
                  <NextImage
                    alt={description}
                    src={icon}
                    width="30"
                    height="30"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
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
        </div>
      </Link>
      {/* ShareButton */}
      <div className="w-full flex justify-center items-center gap-2 pb-6 px-4">
        <ShareButton slug={event.slug} />
        <ViewCounter slug={event.slug} hideText />
      </div>
      <div className="w-full flex flex-col px-4 gap-3">
        {/* Date */}
        <div className="flex justify-start items-start">
          <div>
            <CalendarIcon className="h-5 w-5" />
          </div>
          <p className="px-2 font-medium">
            {event.formattedEnd
              ? `Del ${event.formattedStart} al ${event.formattedEnd}`
              : `${event.nameDay}, ${event.formattedStart}`}
          </p>
        </div>
        {/* Location */}
        <div className="flex justify-start items-start">
          <div>
            <LocationMarkerIcon className="h-5 w-5" />
          </div>
          <div className="h-full flex flex-col justify-start items-start px-2">
            <span>{location}</span>
            <span>{subLocation}</span>
          </div>
        </div>
        {/* hour */}
        <div className="flex justify-start items-center mb-12">
          <ClockIcon className="h-5 w-5" />
          <p className="px-2">
            {event.isFullDayEvent
              ? "Consultar horaris"
              : `${event.startTime} - ${event.endTime}`}
          </p>
        </div>
        {event.tag && <span>{event.tag}</span>}
      </div>
    </>
  );
}

export default memo(Card);
