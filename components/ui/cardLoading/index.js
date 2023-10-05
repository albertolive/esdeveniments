import React from "react";

export default function CardLoading() {
  return (
    <div className="min-w-full w-full flex flex-col content-center bg-whiteCorp mb-10">
      {/* Title */}
      <div className="bg-whiteCorp h-24 flex justify-between items-center gap-2 gap-x-4">
        <div className="w-2 h-1/3 bg-gradient-to-r from-primary to-primarydark px-0 mx-0"></div>
        {/* Title */}
        <div className="w-10/12 flex flex-col gap-4 h-18 animate-fast-pulse">
          <div className="w-4/5 bg-darkCorp h-4 rounded-xl"></div>
          <div className="w-3/4 bg-darkCorp h-4 rounded-xl"></div>
        </div>
        {/* WeatherIcon */}
        <div className="w-2/12 flex justify-center">
          <div className="w-4 h-4 bg-darkCorp opacity-50 rounded-xl"></div>
        </div>
      </div>
      {/* ImageEvent */}
      <div className="h-[254px] bg-darkCorp m-2 animate-fast-pulse"></div>
      {/* Info */}
      {/* InfoEvent */}
      <div className="flex flex-col px-4 pt-8 gap-4">
        {/* Date */}
        <div className="bg-darkCorp h-4 mx-8 rounded-xl text-blackCorp animate-fast-pulse"></div>
        {/* Location */}
        <div className="w-full h-18 flex flex-col gap-4">
          <div className="w-4/5 bg-darkCorp h-4 rounded-xl"></div>
          <div className="w-2/3 bg-darkCorp h-4 rounded-xl"></div>
        </div>
        {/* hour */}
        <div className="flex justify-start items-center">
          <p className="px-2"></p>
        </div>
      </div>
    </div>
  );
}
