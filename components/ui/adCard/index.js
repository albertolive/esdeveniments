import { useState, memo } from "react";
import GoogleAdsenseContainer from "../GoogleAdsense";

export default memo(function AdCard({ event }) {
  const [displayAd, setDisplayAd] = useState(true);

  // if (!displayAd) return;

  return null;

  return (
    <div
      id="ad-card-slot"
      key={event.id}
      className="bg-white rounded-xl shadow-md overflow-hidden lg:max-w-2xl cursor-pointer hover:shadow-gray-500/40"
    >
      <GoogleAdsenseContainer
        slot="5262346605"
        responsive
        setDisplayAd={setDisplayAd}
      />
    </div>
  );
});
