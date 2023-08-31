import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "@components/ui/common/image";
import NextImage from "next/image";
import ClockIcon from "@heroicons/react/outline/ClockIcon";
import LocationMarkerIcon from "@heroicons/react/outline/LocationMarkerIcon";
import { truncateString } from "@utils/helpers";
import { useRouter } from "next/router";

const AdCard = dynamic(() => import("@components/ui/adCard"), {
  loading: () => "",
  noSSR: false,
});

export default function Card({ event }) {
  const { prefetch } = useRouter();

  const handlePrefetch = () => {
    prefetch(`/e/${event.slug}`);
  };

  if (event.isAd)
    return (
      <div className="bg-whiteCorp drop-shadow-lg overflow-hidden lg:max-w-2xl cursor-pointer hover:shadow-gray-500/40 block visible md:hidden md:invisible">
        <AdCard event={event} />
      </div>
    );

  const { description, icon } = event.weather || {};
  const title = truncateString(event.title || "", 70);
  const location = truncateString(event.location || "", 45);
  const subLocation = truncateString(event.subLocation || "", 45);

  return (
    <Link href={`/e/${event.slug}`} passHref prefetch={false}>
      <div
        className="bg-whiteCorp border-t border-darkCorp overflow-hidden cursor-pointer hover:shadow-dark"
        onMouseEnter={handlePrefetch}
        onClick={handlePrefetch}
      >
        {/* Title */}
        <div className="flex justify-between items-start gap-2 py-4 px-4">
          <p className="w-3/4 block text-[19px] tracking-wide font-semibold text-blackCorp hover:underline">
            <a href={`/e/${event.slug}`}>{title}</a>
          </p>
          {/* WeatherIcon */}
          <div className="">
            {icon && (
              <div className="ml-4 lg:absolute lg:right-2 lg:mb-0">
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
        <div className="flex flex-col w-full">
          {/* ImageEvent */}
          <div className="flex-1 h-full object-cover">
            <Image
              className="object-fill max-h-full"
              title={event.title}
              image={event.imageUploaded}
              alt={event.title}
              layout="responsive"
            />
          </div>
          {/* InfoEvent */}
          <div className="flex flex-col justify-center items-start p-4">
            {/* Date */}
            <div className="flex items-center text-blackCorp font-medium p-2">
              {event.formattedEnd
                ? `Del ${event.formattedStart} al ${event.formattedEnd}`
                : `${event.nameDay}, ${event.formattedStart}`}
            </div>

            <div className="flex sm:text-base text-gray-900">
              <div className="flex">
                <LocationMarkerIcon className="h-7 w-7" />
              </div>
              <div className="flex flex-col items-start px-2">
                <span className="">{location}</span>
                <span className="">{subLocation}</span>
              </div>
            </div>
            {event.tag && (
              <span className="p-1 px-2 text-white bg-primary relative items-center border border-transparent shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md">
                {event.tag}
              </span>
            )}
          </div>
          <div className="flex justify-start px-4">
            <div className="pb-8">
              <span className="flex justify-center items-center font-medium">
                <ClockIcon className="h-6 w-6" />
                <span className="ml-3 text-[19px]">
                  {event.startTime} - {event.endTime}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
