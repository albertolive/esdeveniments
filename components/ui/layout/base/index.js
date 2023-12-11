import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

const Navbar = dynamic(() => import("@components/ui/common/navbar"), {
  noSSR: false,
});

const Footer = dynamic(() => import("@components/ui/common/footer"), {
  noSSR: false,
});

// const Notify = dynamic(() => import("@components/ui/common/notify"), {
//   noSSR: false,
// });

export default function BaseLayout({ children }) {
  const memoizedChildren = useMemo(() => children, [children]);

  return (
    <>
      <Head>
        <title>Esdeveniments</title>
        <meta name="description" content="Esdeveniments.cat" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="alternative"
          title="RSS Feed Esdeveniments.cat"
          type="application/rss+xml"
          href="/rss.xml"
        />
      </Head>
      <Navbar />
      {/* <Notify /> */}
      <div className="w-full bg-whiteCorp flex justify-center items-center overflow-hidden">
          {memoizedChildren}
      </div>
      <Footer />
    </>
  );
}
