import { getServerSideSitemap } from "next-sitemap";

import { sanitize } from "@utils/helpers";

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

export const getServerSideProps = async (ctx) => {
  const { getCalendarEvents } = require("@lib/helpers");

  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 4);
  const until = new Date(now.getFullYear(), now.getMonth() + 4);

  const { events } = await getCalendarEvents({
    from,
    until,
    normalizeRss: true,
    maxResults: 2500,
    filterByDate: false,
  });
  const normalizedEvents = JSON.parse(JSON.stringify(events));

  const fields = normalizedEvents
    ?.filter((event) => !event.isAd)
    .map((data) => ({
      loc: `${siteUrl}/${data.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      "image:image": `
    <image:loc>${data.imageUploaded ? data.imageUploaded : undefined
        }</image:loc>
    <image:title>${sanitize(data.title)}</image:title>
  `,
    }));

  return getServerSideSitemap(ctx, fields);
};

export default function Site() { }
