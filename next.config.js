// const { withSentryConfig } = require("@sentry/nextjs");

// const sentryWebpackPluginOptions = {
//   silent: true,
// };

const siteUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
      process.env.NEXT_PUBLIC_VERCEL_ENV === "development"
    ? "https://esdeveniments.vercel.app"
    : "https://www.esdeveniments.cat";

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
  sitemap: {
    baseUrl: siteUrl,
    pages: [],
    exclude: [
      "/api/*",
      "/sitemap.xml",
      "/server-sitemap.xml",
      "/rss.xml",
      "/e/[eventId]",
      "/[place]",
    ],
    trailingSlash: false,
    sitemapSize: 7000,
    robotsTxtOptions: {
      policies: [
        {
          userAgent: "*",
          disallow: ["/404"],
          allow: ["/"],
        },
      ],
      additionalSitemaps: [
        `${siteUrl}/sitemap.xml`,
        `${siteUrl}/server-sitemap.xml`,
      ],
    },
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
      {
        source: "/server-sitemap.xml",
        headers: [
          {
            key: "Content-Type",
            value: "text/xml",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [];
  },
  async rewrites() {
    return [
      {
        source: "/server-sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },
};

module.exports = nextConfig;
