import dynamic from "next/dynamic";
import Head from "next/head";
// import Notify from "@components/ui/common/notify";

const Navbar = dynamic(() => import("@components/ui/common/navbar"), {
  loading: () => "",
});

const Footer = dynamic(() => import("@components/ui/common/footer"), {
  loading: () => "",
});

export default function BaseLayout({ children }) {
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
      <div className="mx-auto pb-[85px]">
        <div className="fit max-w-7xl mx-auto p-4 xl:p-0 xl:py-4">
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}
