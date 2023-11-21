import { useState, memo } from "react";
import NextImage from "next/image";
import ImgDefault from "@components/ui/imgDefault";

const solidColorPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='%23CCC' width='1' height='1'/%3E%3C/svg%3E";

function ImageComponent({
  title,
  date,
  location,
  image,
  className = "h-full",
}) {
  const [hasError, setHasError] = useState(false);
  const imageClassName = `${className}`;

  if (!image || hasError) {
    return (
      <div className={imageClassName}>
        <ImgDefault title={title} date={date} location={location} />
      </div>
    );
  }

  return (
    <div
      className={imageClassName}
      style={{ position: "relative", width: "100%", height: "41vh" }}
    >
      <NextImage
        className="object-cover"
        src={image}
        alt={title}
        placeholder="blur"
        blurDataURL={solidColorPlaceholder}
        loading="lazy"
        onError={() => setHasError(true)}
        quality={75}
        fill
        sizes="100vw"
        style={{
          objectFit: "contain",
        }}
      />
    </div>
  );
}

export default memo(ImageComponent);
