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
  width = "70%",
  height = "100%",
  className = "relative flex",
  layout = "responsive",
}) {
  const { error } = useImage(image);

  const imageClassName = `flex-auto ${className}`;

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
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABFFJREFUWEeNV82KnFUQrerB4Dv4DnmDrEQIwU02WbmZjZnMT0w3cSPoIjAQCIMhM+PClRs3LrIICEKQoOadxGT6llbVqbp1b3eP6Wbmfvfr7ntOnfr9ePnDWxHqL2EisTeRXxMR+15fvmInRJxb8dv2kZAdKjgnVtyPM3RlJVCOJAFYELDDgkgFH37UCTmyE5EdBNxEf4HAZCEAg4yaOVgeggX1lMdV8Nuugp2M1UWBKkng8i9xHTuIWmz7XGf44jRIXa0G/qYLAD4qcPmnn1ZJMABxT2OgKl7pht/D0ir9RgxsJ/BHNwdAQaavNUwDvvp6CryQfGsglu9aDFy+ydPNYP0Hy3kipLd7tIAIfJ1+juCr/q9+TxWcCC8vfvdMS1BEJ8c9yc8i9lKDOeAA3iLYtigwhLOm8eri9aCAEsk/Y+YxGgR7AiC6i9ytWm/KjHUgVOqGCPHq/LdOQMGJaDGRMEJJAgEZdQcuCPCBhBWeko6I5OpGXr341V0AgEogiCyuUaACtyTjoG2qiFmksgypC56/Mo0j9hQ0gXG9SaCroKAziUGNKERZ8McawqvvXw4KBAEF3YMrjNCkQvcvUZCYV5cffSErop5VMn919ssGAQVOInqNuAhXRVlyS3cRgBu8HmdJzkaWpfjZz1Zxw8IKbtc1KPG94N997iTWSaa7xfAhf6ymAA7h5dOfsg4EWJAYlNjhAlWhSr9ufZ8uKM3JVSwuWJ7++EEEapb05ueWBolUACRqCsZ8MNQALUSPnpwXF7D5/v8ViNzu4KlEUSBcFNL3WaEo8Oi7swzCIfAKkZoFKl9XYCZQ3NFAslTErQS++uZ0J4E5E6JeoJ/5wJEumLKhYfjIyShLZ2kpQvzw62997ogChKhfsIx1ALWgNqSYRUL+JNM2s8DcsCUd+WT5OAYfr4CFgPaAWhXL3JLzZ6hQ60FcyzUqRC3hk+Oj0ozE8t67oZSmNHZEnwu8f1c3jNdCLQnUKRl+w2/5+Mt9J2DWe+9XcO+A874PK47uGe3APJER6gqMARmjmplxtH8vZyvv+QqKIcRW2JprdYSPy/aNiYS5wTIB4HltlLM68uEXdzoBDCB2GjcD94E0CGFaCsnQQ9V6k7Co4NYjEywoFbSBkLtB33x475YRsOwGmIJrN7fVSNiQhVmR3fts0UIsvpIsoARDehAIy5uCtyTizw1C/ODuzVRAACy0JuI1CV8RxbURitFsQUx72rBzJdH9As9zhYQRaNRAQNqamqxJWRqBg88/QRDq/HJFQu+J6G8SfucBFuoW1+cAm0P0R0T0MZHcIJY9ElVF3ZHga5J2Ra39QyL6F0FJxAe3ffaO5z/3eNnnY1o0cKRpmeCn5xfzngelGerpWNf4TL168BkPw5ISwe+pFfA+tYzzY84SPkD7S9cIwgI+EAEJvv8pFJgsRxh2ZcoDS8QCwi/nSfsKJFSLTQVYbuBrV8MmKd3/R/ZfOJx/Ne04GrQAAAAASUVORK5CYII="
        />
      </div>
    </>
  );
}
