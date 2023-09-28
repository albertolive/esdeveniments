import { siteUrl } from "@config/index";
import { Feed } from "feed";

const getAllArticles = async () => {
  const { getCalendarEvents } = require("@lib/helpers");

  const now = new Date();
  const from = new Date();
  const until = new Date(now.setDate(now.getDate() + 7));

  const { events } = await getCalendarEvents({
    from,
    until,
    normalizeRss: true,
    filterByDate: false,
  });
  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return normalizedEvents;
};

const buildFeed = (items) => {
  const feed = new Feed({
    id: siteUrl,
    link: siteUrl,
    title: "Esdeveniments.cat",
    description: "Calendari col·laboratiu dels actes culturals de Catalunya",
    copyright: "Esdeveniments.cat",
    updated: new Date(items[0].startDate),
    author: {
      name: "Esdeveniments.cat",
      link: siteUrl,
    },
  });

  const removedDuplicatedItems = items
    .filter((event) => !event.isAd)
    .filter(
      (v, i, a) =>
        a.findIndex((v2) => v2.id.split("_")[0] === v.id.split("_")[0]) === i
    );

  removedDuplicatedItems.forEach((item) => {
    const description = `${item.title}\n\n🗓️ ${item.nameDay} ${item.formattedStart}\n\n🏡 ${item.location} \n\nℹ️ Més informació a l'enllaç de la nostra bio!`;
    const regex = /(http(s?):)([\/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|JPG)/g;
    const hasEventImage = item.description.match(regex);
    const eventImage = hasEventImage && hasEventImage[0];

    feed.addItem({
      id: item.id,
      title: item.title,
      link: `${siteUrl}/${item.slug}`,
      description,
      content: item.location,
      date: new Date(item.startDate),
      image: item.imageUploaded
        ? item.imageUploaded
        : eventImage
        ? eventImage
        : undefined,
    });
  });

  return feed;
};

export const getServerSideProps = async (context) => {
  if (context && context.res) {
    const { res } = context;

    const articles = await getAllArticles();

    const feed = buildFeed(articles);
    res.setHeader("content-type", "text/xml");
    res.write(feed.rss2()); // NOTE: You can also use feed.atom1() or feed.json1() for other feed formats
    res.end();
  }

  return {
    props: {},
  };
};

const RssPage = () => null;

export default RssPage;
