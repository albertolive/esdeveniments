import { useMemo } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

const Navbar = dynamic(() => import("@components/ui/common/navbar"), {
  ssr: true,
});

const Footer = dynamic(() => import("@components/ui/common/footer"), {
  ssr: true,
});

export default function BaseLayout({ children }) {
  const memoizedChildren = useMemo(() => children, [children]);

  return (
    <>
      <Head>
        <title>Esdeveniments</title>
        <meta name="description" content="Esdeveniments.cat" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="alternate"
          title="RSS Feed Esdeveniments.cat"
          type="application/rss+xml"
          href="/rss.xml"
        />
      </Head>
      <Navbar />
      <div className="w-full bg-whiteCorp flex flex-col justify-center items-center overflow-hidden">
        {memoizedChildren}
      </div>
      <Footer />
    </>
  );
}
