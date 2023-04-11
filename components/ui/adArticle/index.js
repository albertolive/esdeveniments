import { useState, memo } from "react";
import GoogleAdsenseContainer from "../GoogleAdsense";

export default memo(function AdArticle({ isDisplay = true, slot }) {
  const [displayAd, setDisplayAd] = useState(true);

  if (!displayAd) return;

  return (
    <div id="ad-article-slot" className="flex">
      <GoogleAdsenseContainer
        slot={slot}
        format={isDisplay ? "auto" : "fluid"}
        responsive={isDisplay}
        layout={isDisplay ? "" : "in-article"}
        style={{ textAlign: isDisplay ? "initial" : "center" }}
        setDisplayAd={setDisplayAd}
      />
    </div>
  );
});
