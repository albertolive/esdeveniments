const { withSentryConfig } = require("@sentry/nextjs");

const sentryWebpackPluginOptions = {
  silent: true,
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

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
    domains: [
      "res.cloudinary.com",
      "www.tarambana.cat",
      "tarambana.cat",
      "www.cinemaesbarjo.cat",
      "www.teatreauditoricardedeu.cat",
      "www.cardedeu.cat",
      "www.llinarsdelvalles.cat",
      "www.canovesisamalus.cat",
      "www.lagarriga.cat",
      "www.granollers.cat",
      "www.llissadevall.cat",
      "www.santantonidevilamajor.cat",
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
  withSentryConfig(nextConfig, sentryWebpackPluginOptions)
);

module.exports = withBundleAnalyzer(nextConfig);
