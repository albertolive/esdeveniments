import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { truncateString } from "@utils/helpers";

const Image = dynamic(() => import("@components/ui/common/image"), {
  loading: () => "",
});

function EventsAroundScroll({ events }) {
  return (
    <div className="w-full flex overflow-x-auto py-4 space-x-4">
      {events.map((event) => {
        const title = truncateString(event.title || "", 60);

        return (
          <Link
            key={event.id}
            href={`/e/${event.slug}`}
            passHref
            prefetch={false}
            legacyBehavior
          >
            <a className="flex-none w-40 min-w-[10rem] flex flex-col bg-white overflow-hidden cursor-pointer">
              {/* ImageEvent */}
              <div className="w-full h-32 flex justify-center items-center overflow-hidden">
                <Image
                  className="w-full object-cover"
                  title={event.title}
                  image={event.imageUploaded}
                  alt={event.title}
                  layout="fill"
                  priority={true}
                />
              </div>
              {/* Title */}
              <div className="p-2">
                <h3 className="text-sm font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                  {title}
                </h3>
              </div>
            </a>
          </Link>
        );
      })}
    </div>
  );
}

export default EventsAroundScroll;
