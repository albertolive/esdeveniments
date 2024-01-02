const { withSentryConfig } = require("@sentry/nextjs");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const sentryWebpackPluginOptions = {
  silent: true,
  org: "esdeveniments",
  project: "javascript-nextjs",
};

const nextConfig = {
  experimental: {
    scrollRestoration: true,
  },
  productionBrowserSourceMaps: true,
  i18n: {
    locales: ["ca-ES"],
    defaultLocale: "ca-ES",
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
      { hostname: "www.tarambana.cat" },
      { hostname: "tarambana.cat" },
      { hostname: "www.cinemaesbarjo.cat" },
      { hostname: "www.teatreauditoricardedeu.cat" },
      { hostname: "www.cardedeu.cat" },
      { hostname: "www.llinarsdelvalles.cat" },
      { hostname: "www.canovesisamalus.cat" },
      { hostname: "www.lagarriga.cat" },
      { hostname: "www.granollers.cat" },
      { hostname: "www.llissadevall.cat" },
      { hostname: "www.santantonidevilamajor.cat" },
      { hostname: "www.martorelles.cat" },
      { hostname: "www.santestevedepalautordera.cat" },
      { hostname: "www.smpalautordera.cat" },
      { hostname: "www.vilamajor.cat" },
      { hostname: "www.parets.cat" },
      { hostname: "www.santfeliudecodines.cat" },
      { hostname: "www.caldesdemontbui.cat" },
      { hostname: "estatics-nasia.dtibcn.cat" },
      { hostname: "www.castellbisbal.cat" },
      { hostname: "www.matadepera.cat" },
      { hostname: "www.montcada.cat" },
      { hostname: "www.rellinars.cat" },
      { hostname: "www.savall.cat" },
      { hostname: "www.staperpetua.cat" },
      { hostname: "www.ullastrell.cat" },
      { hostname: "www.polinya.cat" },
      { hostname: "www.ametlla.cat" },
      { hostname: "www.figaro-montmany.cat" },
      { hostname: "www.fogarsdemontclus.cat" },
      { hostname: "www.llagosta.cat" },
      { hostname: "www.martorelles.cat" },
      { hostname: "www.montseny.cat" },
      { hostname: "www.santfost.cat" },
      { hostname: "www.santamariademartorelles.cat" },
      { hostname: "www.vallgorguina.cat" },
      { hostname: "www.vallromanes.cat" },
      { hostname: "www.vilalbasasserra.cat" },
      { hostname: "www.vilanovadelvalles.cat" },
      { hostname: "alella.cat" },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [];
  },
};

module.exports = withBundleAnalyzer(
  withSentryConfig(nextConfig, sentryWebpackPluginOptions, {
    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    // tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  })
);
