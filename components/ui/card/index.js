import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "@components/ui/common/image";
import NextImage from "next/image";
import ClockIcon from "@heroicons/react/outline/ClockIcon";
import LocationMarkerIcon from "@heroicons/react/outline/LocationMarkerIcon";
import { truncateString } from "@utils/helpers";

const AdCard = dynamic(() => import("@components/ui/adCard"), {
  loading: () => "",
  ssr: false,
});

const IsLoadingComponent = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden lg:max-w-2xl pointer-events-none cursor-none h-48 md:lg-52 lg:h-56 hover:shadow-gray-500/40">
    <div className="animate-pulse flex h-full">
      <div className="flex-1 h-full next-image-wrapper">
        <div className="h-full bg-slate-200 rounded"></div>
      </div>
      <div className="p-4 flex-2">
        <div className="mt-3 mb-3 text-sm sm:text-base text-gray-500 ">
          <div className="h-2 bg-[#ECB84A] opacity-20 rounded"></div>
        </div>
        <div className="mt-3 mb-3 text-sm sm:text-base text-gray-500 ">
          <div className="h-2 bg-black opacity-20 rounded"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-2 bg-slate-200 rounded col-span-2"></div>
          <div className="h-2 bg-slate-200 rounded col-span-1"></div>
        </div>
        <div className="mt-3 mb-3 text-sm sm:text-base text-gray-500 ">
          <div className="h-2 bg-slate-200 rounded"></div>
        </div>
        <div className="mt-3 mb-3 text-sm sm:text-base text-gray-500 ">
          <div className="h-2 bg-slate-200 rounded"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-2 bg-slate-200 rounded col-span-1"></div>
          <div className="h-2 bg-slate-200 rounded col-span-2"></div>
        </div>
        <div className="mt-3 mb-3 text-sm sm:text-base text-gray-500 ">
          <div className="h-2 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function Card({ event, isLoading, isValidating }) {
  if (event.isAd)
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden lg:max-w-2xl cursor-pointer hover:shadow-gray-500/40 block visible md:hidden md:invisible">
        <AdCard event={event} />
      </div>
    );

  const { description, icon } = event.weather || {};
  const image = event.imageUploaded ? event.imageUploaded : undefined;
  const title = truncateString(event.title || "", 70);
  const location = truncateString(event.location || "", 45);
  const subLocation = truncateString(event.subLocation || "", 45);

  if (isLoading) <IsLoadingComponent />;
  if (isValidating) <IsLoadingComponent />;

  return (
    <>hi</>
    // <Link href={`/e/${event.slug}`} passHref prefetch={false}>
    //   <div className="bg-white rounded-xl shadow-md overflow-hidden lg:max-w-2xl cursor-pointer hover:shadow-gray-500/40 max-h-[240px]">
    //     <div className="flex h-full">
    //       <div className="flex-1 h-full next-image-wrapper">
    //         <Image
    //           title={event.title}
    //           image={image}
    //           alt={event.title}
    //           layout="responsive"
    //         />
    //       </div>
    //       <div className="p-4 pr-2 flex-2 lg:relative">
    //         <div className="flex items-center">
    //           <div className="flex items-center tracking-wide text-sm text-[#ECB84A] font-bold">
    //             {event.formattedEnd
    //               ? `Del ${event.formattedStart} al ${event.formattedEnd}`
    //               : `${event.nameDay}, ${event.formattedStart}`}
    //           </div>
    //           {icon && (
    //             <div className="flex mb-4 lg:absolute lg:right-2 lg:mb-0">
    //               <NextImage
    //                 alt={description}
    //                 src={icon}
    //                 width="30px"
    //                 height="30px"
    //               />
    //             </div>
    //           )}
    //         </div>

    //         <p className="block mt-1 text-sm lg:text-xl leading-tight font-bold text-black hover:underline">
    //           <a href={`/e/${event.slug}`}>{title}</a>
    //         </p>
    //         <p className="flex mt-2 mb-4 text-sm sm:text-base text-gray-900">
    //           <LocationMarkerIcon className="h-6 w-6" />
    //           <span className="ml-1">{location}</span>
    //         </p>
    //         <p className="flex mt-2 mb-4 text-sm sm:text-base text-gray-900">
    //           <LocationMarkerIcon className="h-6 w-6" />
    //           <span className="ml-1">{subLocation}</span>
    //         </p>
    //         <div className="mt-2 mb-4 text-sm sm:text-base text-gray-500 ">
    //           <span className="inline-flex p-1 px-2 rounded-full bg-slate-200 items-center border border-transparent shadow-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-grey-500/40">
    //             <ClockIcon className="h-6 w-6" />
    //             <span className="ml-2">
    //               {event.startTime} - {event.endTime}
    //             </span>
    //           </span>
    //         </div>
    //         {event.tag && (
    //           <span className="p-1 px-2 text-white bg-[#ECB84A] relative items-center border border-transparent shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md">
    //             {event.tag}
    //           </span>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </Link>
  );
}
