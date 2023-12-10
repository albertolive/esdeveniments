import React, { useState } from "react";

let lastRandomIndex = null;

function getRandomBackground() {
  const gradients = [
    "linear-gradient( 145deg, #FF0037 10%, #EA5455 100%)",
    "linear-gradient( 145deg, #FF0037 10%, #F6416C 100%)",
    "linear-gradient( 145deg, #FF0037 10%, #FF6A88 100%)",
    "linear-gradient( 145deg, #FF0037 10%, #FF3CAC 100%)",
    "linear-gradient( 145deg, #FF0037 10%, #F55555 100%)",
  ];

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * gradients.length);
  } while (randomIndex === lastRandomIndex);

  lastRandomIndex = randomIndex;

  return gradients[randomIndex];
}

export default function ImgDefault({ title, date }) {
  const [background] = useState(getRandomBackground());

  return (
    <div
      className="bg-whiteCorp flex flex-col justify-center items-start gap-[1px] text-whiteCorp py-6"
    >
      <div 
        className="w-full"
        style={{ background: background }}
      >
        <h1
          className="drop-shadow text-[30px] font-medium leading-8 uppercase px-10 pt-6 pb-4"
          aria-label={title}
        >
          {title}
        </h1>
      </div>
      
      <div 
        className="border-t-4 w-full"
        style={{ background: background }}
      >
        <h3
          className="drop-shadow px-10 pt-4 pb-4 font-normal"
          aria-label={date}
        >
          {date}
        </h3>
      </div>
    </div>
  );
}
