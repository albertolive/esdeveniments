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
      <div className={imageClassName} style={{ position: 'relative', width: '100%', height: '60vh' }}>
        <NextImage
          className="object-cover"
          src={image}
          srcSet={srcSet}
          layout="fill"
          objectFit="contain"
          alt={title}
          placeholder="empty"
          blurDataURL="public/static/images/imago-esdeveniments-fonsclar.png"
        />
      </div>
    </>
  );
}
