import { useState, useEffect, memo } from "react";
import NextImage from "next/image";
import Head from "next/head";
import ImgDefault from "@components/ui/imgDefault";

const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIxMCUiIHkxPSIxMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgxNDUpIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNDQ0NDQ0M7IiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNDQ0NDQ0M7IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CgogIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgLz4KPC9zdmc+Cg==";

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

function ImageComponent({
  title,
  date,
  location,
  image,
  className = "w-auto h-full",
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
        style={{ position: "relative", width: "auto", height: "300px" }}
      >
        <NextImage
          className="object-cover"
          src={image}
          srcSet={srcSet}
          layout="fill"
          objectFit="contain"
          alt={title}
          placeholder="blur"
          blurDataURL={blurDataURL}
        />
      </div>
    </>
  );
}

export default memo(ImageComponent);
