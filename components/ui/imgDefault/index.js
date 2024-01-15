import React, { useState } from "react";
import LocationMarkerIcon from "@heroicons/react/outline/LocationMarkerIcon";

let lastRandomIndex = null;

function getRandomBackground() {
  const gradients = [
    "linear-gradient(120deg, #F23005 10%,#F25430 90%, #F27630 100%)", //red
    "linear-gradient(62deg, #8D13A8 10%,#AF17D1 90%, #CF1CF5 100%)", //violet
    "linear-gradient(38deg, #00A8A3 10%,#00D1CA 90%, #00F4EA 100%)", //turquoise
    "linear-gradient(20deg, #76A800 10%,#92D100 90%, #ABF501 100%)", //green
    "linear-gradient(170deg, #F4EB00 10%,#D1CA00 90%, #A8A300 100%)", //yellow
  ];

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * gradients.length);
  } while (randomIndex === lastRandomIndex);

  lastRandomIndex = randomIndex;

  return gradients[randomIndex];
}

export default function ImgDefault({ title, location }) {
  const [background] = useState(getRandomBackground());
  const [dimensions] = useState({
    width: Math.floor(Math.random() * 180) + 180,
    height: Math.floor(Math.random() * 180) + 180,
  });

  return (
    <div className="w-full bg-whiteCorp flex justify-center items-start">
      <div className="w-full mt-4 py-4 flex flex-col gap-4 relative left-4 z-1 bg-whiteCorp shadow-lg">
        <h1 className="px-2 drop-shadow uppercase" aria-label={title}>
          {title}
        </h1>
      </div>
      <div
        className={`w-full flex flex-col justify-between items-end gap-2 p-4 relative right-4`}
        style={{
          background: background,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
      >
        <LocationMarkerIcon className="text-whiteCorp w-7 h-7" />
        <h2
          className="text-right tracking-wider text-whiteCorp"
          aria-label={location}
        >
          {location}
        </h2>
      </div>
    </div>
  );
}
