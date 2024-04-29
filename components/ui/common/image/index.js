import { useState, memo, useRef } from "react";
import NextImage from "next/image";
import dynamic from "next/dynamic";
import useOnScreen from "@components/hooks/useOnScreen";
import { env } from "@utils/helpers";

const ImgDefault = dynamic(() => import("@components/ui/imgDefault"), {
  loading: () => (
    <div className="flex justify-center items-center w-full">
      <div className="w-full h-60 bg-darkCorp animate-fast-pulse"></div>
    </div>
  ),
});

function ImageComponent({
  title,
  date,
  location,
  subLocation,
  image,
  className = "w-full h-full flex justify-center items-center",
  priority = false,
}) {
  const imgDefaultRef = useRef();
  const isImgDefaultVisible = useOnScreen(imgDefaultRef);
  const [hasError, setHasError] = useState(false);
  const imageClassName = `${className}`;

  if (!image || hasError) {
    return (
      <div className={imageClassName} ref={imgDefaultRef}>
        {isImgDefaultVisible ? (
          <ImgDefault
            title={title}
            date={date}
            location={location}
            subLocation={subLocation}
            alt={title}
          />
        ) : (
          <div className="flex justify-center items-center w-full">
            <div className="w-full h-60 bg-darkCorp animate-fast-pulse"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={imageClassName} style={{ position: "relative" }}>
      <NextImage
        className="object-contain"
        src={image}
        alt={title}
        width={500}
        height={260}
        loading={priority ? "eager" : "lazy"}
        onError={() => setHasError(true)}
        quality={70}
        style={{
          objectFit: "contain",
        }}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        unoptimized={env === "dev"}
      />
    </div>
  );
}

export default memo(ImageComponent);
