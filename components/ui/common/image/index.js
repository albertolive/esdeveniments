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
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIxMCUiIHkxPSIxMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgxNDUpIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNiNjkyZmU7IiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNFQTU0NTU7IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CgogIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgLz4KPC9zdmc+Cg==",
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIxMCUiIHkxPSIxMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgxNDUpIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkY2Qjc7IiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGNjQxNkM7IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CgogIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgLz4KPC9zdmc+Cg==",
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIxMCUiIHkxPSIxMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgxNDUpIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0M0NCRkY7IiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM5NzA4Q0M7IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CgogIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgLz4KPC9zdmc+Cg==",
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIxMCUiIHkxPSIxMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgxNDUpIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3OUYxQTQ7IiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwRTVDQUQ7IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CgogIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgLz4KPC9zdmc+Cg==",
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIxMCUiIHkxPSIxMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgxNDUpIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkY3MjA7IiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzQ0Q1MDA7IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CgogIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgLz4KPC9zdmc+Cg==",
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
        style={{ position: "relative", width: "100%", height: "60vh" }}
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
