import { useState, useEffect, memo } from "react";
import NextImage from "next/image";
import Head from "next/head";
import ImgDefault from "@components/ui/imgDefault";

const useImage = (url) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    if (url) {
      const img = new Image();
      img.src = url;
      img.onerror = () => {
        setError(true);
      };
    } else {
      setError(true);
    }
  }, [url]);

  return { error };
};

function getRandomBackground() {
  const gradients = [
    "linear-gradient( 145deg, #b692fe 10%, #EA5455 100%)",
    "linear-gradient( 145deg, #FFF6B7 10%, #F6416C 100%)",
    "linear-gradient( 145deg, #FF9A8B 10%, #FF6A88 100%)",
    "linear-gradient( 145deg, #FFD8CB 10%, #FF3CAC 100%)",
    "linear-gradient( 145deg, #FCCF31 10%, #F55555 100%)",
  ];

  const randomIndex = Math.floor(Math.random() * gradients.length);

  return gradients[randomIndex];
}

function ImageComponent({
  title,
  date,
  location,
  image,
  className = "h-full",
}) {
  const { error } = useImage(image);

  const imageClassName = `${className}`;

  const srcSet = `${image} 1200w,
                  ${image}?w=200 200w,
                  ${image}?w=400 400w, 
                  ${image}?w=800 800w, 
                  ${image}?w=1024 1024w`;

  if (error || !image) {
    return (
      <div className={imageClassName}>
        <ImgDefault title={title} date={date} location={location} />
      </div>
    );
  }

  return (
    <>
      <Head>
        <link
          rel="prefetch"
          href={image}
          as="image"
          crossOrigin="true"
          imagesrcset={srcSet}
          imagesizes="100vw"
        />
      </Head>
      <div
        className={imageClassName}
        style={{ position: "relative", width: "100%", height: "41vh" }}
      >
        <NextImage
          className="object-cover"
          src={image}
          srcSet={srcSet}
          layout="fill"
          objectFit="contain"
          alt={title}
          placeholder="blur"
          blurDataURL={getRandomBackground()}
        />
      </div>
    </>
  );
}

export default memo(ImageComponent);
