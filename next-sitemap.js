import { siteUrl } from "@config/index";

module.exports = {
  siteUrl,
  exclude: [
    "api",
    "_app.js",
    "_document.js",
    "404.js",
    "_error.js",
    "sitemap.xml.js",
    "server-sitemap.xml",
    "server-sitemap.xml.js",
    "/server-sitemap.xml",
    "/server-sitemap.xml.js",
    "rss.xml",
    "/rss.xml",
    ".next",
    "___next_launcher.js",
    "___vc",
    "node_modules",
    "package.json",
    "[eventId]",
    "[place]",
  ],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: ["/404"],
      },
      { userAgent: "*", allow: "/" },
    ],
    additionalSitemaps: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/server-sitemap.xml`,
    ],
  },
};
