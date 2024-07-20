import { memo, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextImage from "next/image";
import {
  ClockIcon,
  LocationMarkerIcon,
  CalendarIcon,
} from "@heroicons/react/outline";
import { truncateString } from "@utils/helpers";
import useOnScreen from "@components/hooks/useOnScreen";
import Image from "@components/ui/common/image";
import useCheckMobileScreen from "@components/hooks/useCheckMobileScreen";

const ViewCounter = dynamic(() => import("@components/ui/viewCounter"), {
  loading: () => (
    <div className="w-5 h-5 bg-gray-200 animate-pulse rounded-full"></div>
  ),
  ssr: false,
});

const NativeShareButton = dynamic(
  () => import("@components/ui/common/nativeShareButton"),
  {
    loading: () => "",
    ssr: false,
  }
);

const ShareButton = dynamic(
  () => import("@components/ui/common/cardShareButton"),
  {
    loading: () => "",
    ssr: false,
  }
);

function CardContent({ event, isPriority, isHorizontal }) {
  const counterRef = useRef();
  const shareRef = useRef();
  const isCounterVisible = useOnScreen(counterRef, {
    freezeOnceVisible: true,
  });
  const { prefetch } = useRouter();
  const [isCardLoading, setIsCardLoading] = useState(false);
  const isMobile = useCheckMobileScreen();

  const handlePrefetch = useCallback(() => {
    prefetch(`/e/${event.slug}`);
  }, [event.slug, prefetch]);

  const handleClick = useCallback(() => {
    setIsCardLoading(true);
  }, []);

  const { description, icon } = event.weather || {};

  const memoizedValues = useMemo(
    () => ({
      title: truncateString(event.title || "", isHorizontal ? 30 : 75),
      location: truncateString(event.location || ""),
      subLocation: truncateString(event.subLocation || "", 45),
      image: event.imageUploaded || event.eventImage,
      eventDate: event.formattedEnd
        ? `Del ${event.formattedStart} al ${event.formattedEnd}`
        : `${event.nameDay}, ${event.formattedStart}`,
    }),
    [event, isHorizontal]
  );

  return (
    <>
      <Link
        href={`/e/${event.slug}`}
        passHref
        prefetch={false}
        className="w-full"
        legacyBehavior
      >
        <div
          className={`w-full flex flex-col justify-center bg-whiteCorp overflow-hidden cursor-pointer ${
            isCardLoading ? "opacity-50 animate-pulse" : ""
          }`}
          onMouseEnter={handlePrefetch}
          onTouchStart={handlePrefetch}
          onClick={handleClick}
        >
          {/* Title */}
          <div className="bg-whiteCorp h-fit flex justify-between items-start gap-2 pr-4">
            <div className="flex justify-start items-center gap-0 pt-[2px] m-0">
              <div className="w-2 h-6 bg-gradient-to-r from-primary to-primarydark"></div>
            </div>
            {/* Title */}
            <h3 className="w-11/12 uppercase">
              <Link href={`/e/${event.slug}`} passHref prefetch={false}>
                {memoizedValues.title}
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
          <div className="p-4 flex justify-center items-center" ref={shareRef}>
            <div
              className="w-full relative"
              style={{ height: isHorizontal ? "16rem" : "auto" }}
            >
              <Image
                className={`w-full ${
                  isHorizontal ? "h-64 object-cover" : "object-contain"
                }`}
                title={event.title}
                date={memoizedValues.eventDate}
                location={event.location}
                subLocation={event.subLocation}
                image={memoizedValues.image}
                alt={event.title}
                priority={isPriority}
              />
            </div>
          </div>
        </div>
      </Link>
      {/* ShareButton, Date, and ViewCounter */}
      <div
        className="w-full flex justify-center items-center gap-2 pb-4 px-4"
        ref={counterRef}
      >
        {!isMobile ? (
          <ShareButton slug={event.slug} />
        ) : (
          <NativeShareButton
            title={event.title}
            text={event.description}
            url={`/e/${event.slug}`}
            date={memoizedValues.eventDate}
            location={memoizedValues.location}
            subLocation={memoizedValues.subLocation}
          />
        )}
        {isCounterVisible && <ViewCounter slug={event.slug} hideText />}
      </div>
      <div className="w-full flex flex-col px-4 gap-3">
        <div className="flex justify-start items-start">
          <div>
            <CalendarIcon className="h-5 w-5" />
          </div>
          <p className="px-2 font-semibold">{memoizedValues.eventDate}</p>
        </div>
        {/* Location */}
        <div className="flex justify-start items-start">
          <div>
            <LocationMarkerIcon className="h-5 w-5" />
          </div>
          <div className="h-full flex flex-col justify-start items-start px-2">
            <span className="max-w-full">{memoizedValues.location}</span>
            <span className="max-w-full">{memoizedValues.subLocation}</span>
          </div>
        </div>
        {/* hour */}
        <div className="flex justify-start items-center">
          <ClockIcon className="h-5 w-5" />
          <p className="px-2">
            {event.isFullDayEvent
              ? "Consultar horaris"
              : `${event.startTime} - ${event.endTime}`}
          </p>
        </div>
        {!isHorizontal && <div className="mb-8" />}
      </div>
    </>
  );
}

export default memo(CardContent);
