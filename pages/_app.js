import "@styles/globals.css";

import { useEffect, useCallback } from "react";
import Script from "next/script";
import { BaseLayout } from "@components/ui/layout";
import { useRouter } from "next/router";
import { generateRegionsOptions } from "@utils/helpers";

function EsdevenimentsMainEntry({ Component, pageProps }) {
  const { events } = useRouter();

  const dynamicURLs = generateRegionsOptions().map(({ value }) => `/${value}`);

  const handleRouteChange = useCallback(
    (url) => {
      const urlsToCheck = [
        "/",
        "/qui-som",
        "sitemap",
        "/publica",
        ...dynamicURLs,
      ];
      const shouldResetSearchTerm =
        urlsToCheck.some((checkUrl) => url.startsWith(checkUrl)) &&
        !url.startsWith("/cerca");

      if (
        typeof window !== "undefined" &&
        window.localStorage !== undefined &&
        shouldResetSearchTerm
      ) {
        localStorage.setItem("searchTerm", JSON.stringify(""));
      }
    },
    [dynamicURLs]
  );

  useEffect(() => {
    events.on("routeChangeComplete", handleRouteChange);

    return () => {
      events.off("routeChangeComplete", handleRouteChange);
    };
  }, [events, handleRouteChange]);

  return (
    <>
      <Script
        id="google-analytics-gtag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        onLoad={() => {
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("js", new Date());
          gtag("config", "${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}", {
            page_path: window.location.pathname,
          });
        }}
      />

      <Script
        id="google-ads"
        strategy="lazyOnload"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS}`}
      />

      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </>
  );
}

export default EsdevenimentsMainEntry;
