import { memo, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextImage from "next/image";
import ClockIcon from "@heroicons/react/outline/ClockIcon";
import LocationMarkerIcon from "@heroicons/react/outline/LocationMarkerIcon";
import CalendarIcon from "@heroicons/react/outline/CalendarIcon";
import { truncateString } from "@utils/helpers";
import useOnScreen from "@components/hooks/useOnScreen";

const Image = dynamic(() => import("@components/ui/common/image"), {
  loading: () => "",
});

const AdCard = dynamic(() => import("@components/ui/adCard"), {
  loading: () => "",
  ssr: false,
});

const CardLoading = dynamic(() => import("@components/ui/cardLoading"), {
  loading: () => "",
});

const ShareButton = dynamic(
  () => import("@components/ui/common/cardShareButton"),
  {
    loading: () => "",
  }
);

const ViewCounter = dynamic(() => import("@components/ui/viewCounter"), {
  loading: () => "",
  ssr: false,
});

function Card({ event, isLoading, isPriority }) {
  const counterRef = useRef();
  const shareRef = useRef();
  const isCounterVisible = useOnScreen(counterRef);
  const isShareVisible = useOnScreen(shareRef);
  const { prefetch } = useRouter();

  const handlePrefetch = () => {
    prefetch(`/e/${event.slug}`);
  };

  if (isLoading) return <CardLoading />;

  if (event.isAd) {
    return <AdCard event={event} />;
  }

  const { description, icon } = event.weather || {};
  const title = truncateString(event.title || "", 60);
  const location = truncateString(event.location || "");
  const subLocation = truncateString(event.subLocation || "", 45);
  const image = event.imageUploaded || event.eventImage;

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
            <div className="w-1/12 flex justify-end h-30">
              {icon && (
                <NextImage
                  alt={description}
                  src={icon}
                  width="30"
                  height="30"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                  priority={isPriority}
                />
              )}
            </div>
          </div>
          {/* ImageEvent */}
          <div className="p-4 flex justify-center items-center">
            <Image
              className="w-full flex justify-center object-contain"
              title={event.title}
              date={event.formattedStart}
              location={event.location}
              subLocation={event.subLocation}
              image={image}
              alt={event.title}
              layout="responsive"
              priority={isPriority}
            />
          </div>
        </div>
      </Link>
      {/* ShareButton */}
      <div
        className="w-full flex justify-center items-center gap-2 pb-6 px-4"
        ref={counterRef}
      >
        {isShareVisible && <ShareButton slug={event.slug} />}
        {isCounterVisible && <ViewCounter slug={event.slug} hideText />}
      </div>
      <div className="w-full flex flex-col px-4 gap-3">
        {/* Date */}
        <div className="flex justify-start items-start">
          <div>
            <CalendarIcon className="h-5 w-5" />
          </div>
          <p className="px-2 font-semibold">
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
