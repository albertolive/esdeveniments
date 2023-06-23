import { useEffect, useRef } from "react";

const GoogleAdsenseContainer = ({
  style,
  layout,
  format,
  responsive,
  slot,
  setDisplayAd,
}) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (
      adRef.current &&
      adRef.current.children &&
      adRef.current.children.length > 0
    ) {
      return; // Ad already loaded in this element, return early
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log("adsense error", err);
    }
  }, []);

  useEffect(() => {
    const callback = (mutationsList) => {
      mutationsList.forEach((element) => {
        if (element.target.attributes["data-ad-status"].value === "unfilled") {
          setDisplayAd && setDisplayAd(false);
        }
      });
    };

    const obs = new MutationObserver(callback);

    obs.observe(document.querySelector("ins"), {
      attributeFilter: ["data-ad-status"],
      attributes: true,
    });

    return () => obs.disconnect();
  }, [setDisplayAd]);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle w-full"
      style={{ display: "block", ...style }}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
      data-ad-layout={layout}
    ></ins>
  );
};

export default GoogleAdsenseContainer;
