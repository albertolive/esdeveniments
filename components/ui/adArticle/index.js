import { useState, memo } from "react";
import GoogleAdsenseContainer from "../GoogleAdsense";

export default memo(function AdArticle({ isDisplay = true, slot }) {
  const [displayAd, setDisplayAd] = useState(true);

  if (!displayAd)
    return (
      <div style={{ height: "300px", width: "100%" }}>
        L&apos;anunci no s&apos;ha pogut carregar. Si us plau, ajuda&apos;ns a
        mantenir aquesta pàgina desactivant qualsevol bloquejador
        d&apos;anuncis. Gràcies per la teva comprensió i suport!
      </div>
    );

  return (
    <div className="flex z-10">
      <GoogleAdsenseContainer
        id={slot}
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
