import { useState } from "react";
import Image from "next/image";
import defaultImage from "@public/static/images/locations/cardedeu/1.jpeg";
import Head from "next/head";
import ImgDefault from '@components/ui/imgDefault'

export default function ImageComponent({
  title,
  image = ImgDefault, // Si no hay imagen en el RSS, se utiliza la imagen predeterminada
  width = "100%",
  height = "100%",
  className = "relative w-full h-full",
  layout = "responsive",
}) {
  const [src, setSrc] = useState(image);
  const [error, setError] = useState(false);

  const onError = () => {
    setError(true);
    // Si hay un error al cargar la imagen del RSS, utiliza el componente ImgDefault
    setSrc(null);
  };

  if (error) {
    return (
      <>
        <Head>
          <link
            rel="prefetch"
            href={ImgDefault}
            as="image"
            crossOrigin="true"
            imageSrcSet={`${ImgDefault} 1200w,
                          ${ImgDefault}?w=200 200w, 
                          ${ImgDefault}?w=400 400w, 
                          ${ImgDefault}?w=800 800w, 
                          ${ImgDefault}?w=1024 1024w`
                        }
          />
        </Head>
        <div className={`flex-1 h-full next-image-wrapper ${className}`}>
          {/* Utiliza ImgDefault como el componente de imagen */}
          <ImgDefault />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <link
          rel="prefetch"
          href={src}
          as="image"
          crossOrigin="true"
          imageSrcSet={`${src} 1200w,
                        ${src}?w=200 200w, 
                        ${src}?w=400 400w, 
                        ${src}?w=800 800w, 
                        ${src}?w=1024 1024w`
                      }
        />
      </Head>
      <div className={`flex-1 h-full next-image-wrapper ${className}`}>
        <Image
          className="object-contain"
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
          blurDataURL= {ImgDefault}
          onError={onError}
        />
      </div>
    </>
  );
}
