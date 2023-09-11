import React, { useState } from "react";

function getRandomBackground() {
  const gradients = [
    "linear-gradient( 135deg, #FEB692 10%, #EA5455 100%)",
    "linear-gradient( 135deg, #FFF6B7 10%, #F6416C 100%)",
    "linear-gradient( 135deg, #43CBFF 10%, #9708CC 100%)",
    "linear-gradient( 135deg, #79F1A4 10%, #0E5CAD 100%)",
    "linear-gradient( 135deg, #FFF720 10%, #3CD500 100%)",
  ];

  const randomIndex = Math.floor(Math.random() * gradients.length);

  return gradients[randomIndex];
}

export default function ImgDefault({ title, date, location }) {
  const [background] = useState(getRandomBackground());

  return (
    <div
      className="flex flex-col justify-center items-center gap-y-8 text-whiteCorp px-16 pt-14 pb-16"
      style={{ background: background, height: "32rem" }}
    >
      <h1
        className="drop-shadow text-[54px] font-bold"
        aria-label={title}
      >
        {title}
      </h1>
      <h2
        className="drop-shadow text-[39px] font-medium border-t-2 pt-6"
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
