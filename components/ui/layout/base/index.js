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
      <div className="bg-whiteCorp mx-auto pb-40">
        <div className="mx-0 px-0 py-4 md:px-20 lg:px-40 xl:px-60 2xl:px-80">
          {memoizedChildren}
        </div>
      </div>
      <Footer />
    </>
  );
}
