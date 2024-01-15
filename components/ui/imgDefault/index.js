import React, { useState, useEffect } from "react";
import axios from "axios";

let lastRandomIndex = null;

async function getRandomImage() {
  try {
    const response = await axios.get(
      "https://api.pexels.com/v1/search?query=calle+ciudad&per_page=10",
      {
        headers: {
          Authorization:
            "zahN9ipHEtA0QgerhONZ8hmRVXOsABDFoZegX6IINRunTuWyYZnAMerq",
        },
      }
    );

    const photos = response.data.photos;
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * photos.length);
    } while (randomIndex === lastRandomIndex);

    lastRandomIndex = randomIndex;

    return photos[randomIndex].src.large;
  } catch (error) {
    console.error("Error fetching photos from Pexels API", error);
  }
}

export default function ImgDefault({ title, date }) {
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    getRandomImage().then((image) => setBackgroundImage(image));
  }, []);

  return (
    <div className="w-full bg-whiteCorp flex justify-start items-start">
      <div className="w-full py-4 flex flex-col gap-4 relative left-4 z-1">
        <div className="py-4 bg-whiteCorp shadow-lg">
          <h1
            className="px-2 drop-shadow text-center font-medium leading-8 uppercase"
            aria-label={title}
          >
            {title}
          </h1>
        </div>
        <div className="py-4 bg-whiteCorp relative left-8 shadow-lg">
          <h3
            className="font-normal text-center text-blackCorp"
            aria-label={date}
          >
            {date}
          </h3>
        </div>
      </div>
      <div
        className="w-full h-[250px] relative right-4"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
}
