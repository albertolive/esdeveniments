import { useState, useEffect } from "react";
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

export default function ImageComponent({
  title,
  date,
  location,
  image,
  width = "100%",
  height = "100%",
  className = "max-h-[100%] max-w-[100%]",
  layout = "responsive",
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
      <div className={imageClassName}>
        <NextImage
          className="object-contain"
          src={image}
          srcSet={srcSet}
          layout={layout}
          width={width}
          height={height}
          alt={title}
          placeholder="empty"
          blurDataURL="public/static/images/imago-esdeveniments-fonsclar.png"
        />
      </div>
    </>
  );
}
