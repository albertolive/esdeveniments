import { useEffect, useRef } from "react";

export default function Maps({ location }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const frame = document.createElement("iframe");
    frame.src = map.getAttribute("data-src");
    const onLoad = () => {
      // Remove the event listener to prevent memory leaks
      frame.removeEventListener("load", onLoad);
    };
    frame.addEventListener("load", onLoad);
    map.appendChild(frame);

    return () => {
      map.removeChild(frame);
    };
  }, [mapRef]);

  return (
    <div
      className="aspect-w-1 aspect-h-1 bg-darkCorp overflow-hidden"
      data-src={`https://www.google.com/maps/embed/v1/place?q=${location}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS}`}
      id="mymap"
      ref={mapRef}
    ></div>
  );
}
