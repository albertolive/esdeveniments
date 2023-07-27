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
      <div className="bg-white rounded-xl shadow-md overflow-hidden lg:max-w-2xl cursor-pointer hover:shadow-gray-500/40 block visible md:hidden md:invisible">
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
        className="bg-white rounded-xl shadow-md overflow-hidden lg:max-w-2xl cursor-pointer hover:shadow-gray-500/40 max-h-[240px]"
        onMouseEnter={handlePrefetch}
        onClick={handlePrefetch}
      >
        <div className="flex h-full">
          <div className="flex-1 h-full next-image-wrapper">
            <Image
              title={event.title}
              image={event.imageUploaded}
              alt={event.title}
              layout="responsive"
            />
          </div>
          <div className="p-4 pr-2 flex-2 lg:relative">
            <div className="flex items-center">
              <div className="flex items-center tracking-wide text-sm text-[#ECB84A] font-bold">
                {event.formattedEnd
                  ? `Del ${event.formattedStart} al ${event.formattedEnd}`
                  : `${event.nameDay}, ${event.formattedStart}`}
              </div>
              {icon && (
                <div className="flex mb-4 lg:absolute lg:right-2 lg:mb-0">
                  <NextImage
                    alt={description}
                    src={icon}
                    width="30px"
                    height="30px"
                  />
                </div>
              )}
            </div>

            <p className="block mt-1 text-sm lg:text-xl leading-tight font-bold text-black hover:underline">
              <a href={`/e/${event.slug}`}>{title}</a>
            </p>
            <p className="flex mt-2 mb-4 text-sm sm:text-base text-gray-900">
              <LocationMarkerIcon className="h-6 w-6" />
              <span className="ml-1">{location}</span>
            </p>
            <p className="flex mt-2 mb-4 text-sm sm:text-base text-gray-900">
              <LocationMarkerIcon className="h-6 w-6" />
              <span className="ml-1">{subLocation}</span>
            </p>
            <div className="mt-2 mb-4 text-sm sm:text-base text-gray-500 ">
              <span className="inline-flex p-1 px-2 rounded-full bg-slate-200 items-center border border-transparent shadow-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-grey-500/40">
                <ClockIcon className="h-6 w-6" />
                <span className="ml-2">
                  {event.startTime} - {event.endTime}
                </span>
              </span>
            </div>
            {event.tag && (
              <span className="p-1 px-2 text-white bg-[#ECB84A] relative items-center border border-transparent shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md">
                {event.tag}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
