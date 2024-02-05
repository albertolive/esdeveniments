import { useState, memo } from "react";
import NextImage from "next/image";
import dynamic from "next/dynamic";

const ImgDefault = dynamic(() => import("@components/ui/imgDefault"), {
  loading: () => "",
});

const solidColorPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='%23CCC' width='1' height='1'/%3E%3C/svg%3E";

function ImageComponent({
  title,
  date,
  location,
  subLocation,
  image,
  className = "w-full h-full flex justify-center items-center",
}) {
  const [hasError, setHasError] = useState(false);
  const imageClassName = `${className}`;

  if (!image || hasError) {
    return (
      <div className={imageClassName}>
        <ImgDefault
          title={title}
          date={date}
          location={location}
          subLocation={subLocation}
          alt={title}
        />
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
        height={500}
        placeholder="blur"
        blurDataURL={solidColorPlaceholder}
        loading="lazy"
        onError={() => setHasError(true)}
        quality={75}
        style={{
          objectFit: "contain",
        }}
      />
    </div>
  );
}

export default memo(ImageComponent);
