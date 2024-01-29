import "@styles/globals.css";

import { useEffect, memo, Suspense } from "react";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { BaseLayout } from "@components/ui/layout";

function EsdevenimentsMainEntry({ Component, pageProps }) {
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("currentPage");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <Script
        id="google-analytics-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script id="google-analytics-lazy-load">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
        page_path: window.location.pathname,
        });
    `}
      </Script>

      <Script
        id="google-ads"
        strategy="lazyOnload"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS}`}
      />

      <Script
        src="https://fundingchoicesmessages.google.com/i/pub-2456713018173238?ers=1"
        strategy="lazyOnload"
      />

      <Script id="google-adblock" strategy="lazyOnload">
        {`
          (function() {
            function signalGooglefcPresent() {
              if (!window.frames['googlefcPresent']) {
                if (document.body) {
                  const iframe = document.createElement('iframe');
                  iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';
                  iframe.style.display = 'none';
                  iframe.name = 'googlefcPresent';
                  document.body.appendChild(iframe);
                } else {
                  setTimeout(signalGooglefcPresent, 0);
                }
              }
            }
            signalGooglefcPresent();
          })();
        `}
      </Script>

      <BaseLayout>
        <Suspense fallback={<></>}>
          <Component {...pageProps} />
          <SpeedInsights />
          <Analytics />
        </Suspense>
      </BaseLayout>
    </>
  );
}

export default memo(EsdevenimentsMainEntry);
