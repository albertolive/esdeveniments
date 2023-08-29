import { useState } from "react";
import Image from "next/image";
import defaultImage from "@public/static/images/locations/cardedeu/1.jpeg";
import Head from "next/head";

export default function ImageComponent({
  title,
  image = defaultImage,
  width = 200,
  height = 230,
  className = "",
  layout = "responsive",
}) {
  const [src, setSrc] = useState(image);
  const [error, setError] = useState(false);

  const onError = () => {
    setError(true);
    setSrc(defaultImage);
  };

  if (error) return null;

  return (
    <>
      <Head>
        <link
          rel="prefetch"
          href={image}
          as="image"
          crossOrigin="true"
          imageSrcSet={`${image} 1200w,
                        ${image}?w=200 200w, 
                        ${image}?w=400 400w, 
                        ${image}?w=800 800w, 
                        ${image}?w=1024 1024w`
                      }
        />
      </Head>
      <div className={`flex-1 h-full next-image-wrapper ${className}`}>
        <Image
          className="object-cover"
          src={src}
          srcSet={`${src} 1200w, 
                  ${src}?w=200 200w,
                  ${src}?w=400 400w, 
                  ${src}?w=800 800w, 
                  ${src}?w=1024 1024w`
                }
          layout={layout}
          width={width}
          height={height}
          alt={title}
          placeholder="blur"
          blurDataURL="/static/images/blur.png"
          onError={onError}
        />
      </div>
    </>
  );
}
