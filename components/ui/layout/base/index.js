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
        <link rel="icon" href="/favicon.png" />
        <link
          rel="alternative"
          title="RSS Feed Esdeveniments.cat"
          type="application/rss+xml"
          href="/rss.xml"
        />
      </Head>
      <Navbar />
      {/* <Notify /> */}
      <div className="bg-whiteCorp">
        <div className="max-w-full mx-auto px-0 pt-4
        sm:px-10 sm:max-w-[576px] 
        md:px-20 md:max-w-[768px] 
        lg:px-40 lg:max-w-[1024px]">
          {memoizedChildren}
        </div>
      </div>

      <Footer />
    </>
  );
}
