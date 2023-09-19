import React, { useState } from "react";

function getRandomBackground() {
  const gradients = [
    "linear-gradient( 145deg, #b692fe 10%, #EA5455 100%)",
    "linear-gradient( 145deg, #FFF6B7 10%, #F6416C 100%)",
    "linear-gradient( 145deg, #43CBFF 10%, #9708CC 100%)",
    "linear-gradient( 145deg, #79F1A4 10%, #0E5CAD 100%)",
    "linear-gradient( 145deg, #FFF720 10%, #3CD500 100%)",
  ];

  const randomIndex = Math.floor(Math.random() * gradients.length);

  return gradients[randomIndex];
}

export default function ImgDefault({ title, date, location }) {
  const [background] = useState(getRandomBackground());

  return (
    <div
      className="flex flex-col items-start gap-y-6 text-whiteCorp max-h-[100%] py-6"
      style={{ background: background }}
    >
      <h1
        className="drop-shadow text-[54px] leading-none font-bold px-10 pt-14"
        aria-label={title}
      >
        {title}
      </h1>
      <div className="border-t-4 w-full mr-32"></div>
      <h2
        className="drop-shadow text-[28px] px-10 pb-16 font-normal"
        aria-label={date}
      >
        {date}
      </h2>
      {/* <p
        className="drop-shadow text-center text-[21px] font-normal tracking-wider"
        aria-label={location}
      >
        {location}
      </p> */}
    </div>
  );
}
