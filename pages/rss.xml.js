import { siteUrl } from "@config/index";
import { Feed } from "feed";
import { getCalendarEvents } from "@lib/helpers";
import { MAX_RESULTS } from "@utils/constants";
import { getPlaceTypeAndLabel } from "@utils/helpers";
import { captureException } from "@sentry/nextjs";

const SITE_NAME = "Esdeveniments.cat";

const getAllArticles = async (region, town, maxEventsPerDay) => {
  const { label: regionLabel } = getPlaceTypeAndLabel(region);
  const { label: townLabel } = getPlaceTypeAndLabel(town);

  try {
    const now = new Date();
    const from = new Date();
    const until = new Date(now.setDate(now.getDate() + 7)); // TODO: Change to accept a parameter

    const q = town ? `${townLabel} ${regionLabel}` : regionLabel;

    const { events } = await getCalendarEvents({
      from,
      until,
      q,
      normalizeRss: true,
      filterByDate: false,
      maxResults: MAX_RESULTS,
      shuffleItems: true,
    });

    // Limit the number of events
    const limitedEvents = events.slice(0, maxEventsPerDay);

    return JSON.parse(JSON.stringify(limitedEvents));
  } catch (error) {
    console.error(error);
    captureException(
      `Error getting all articles to generate the RSS feed for ${
        townLabel || regionLabel || "Catalunya"
      }: ${error}`
    );
    return [];
  }
};

const selectImage = (item) => {
  const regex = /(http(s?):)([\/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|JPG)/g;
  const hasEventImage = item.description.match(regex);
  const eventImage = hasEventImage && hasEventImage[0];

  return item.imageUploaded
    ? item.imageUploaded
    : eventImage
    ? eventImage
    : undefined;
};

const buildFeed = (items, region, town) => {
  const { label: regionLabel } = getPlaceTypeAndLabel(region);
  const { label: townLabel } = getPlaceTypeAndLabel(town);

  const feed = new Feed({
    id: siteUrl,
    link: siteUrl,
    title: `Rss ${SITE_NAME} - ${townLabel || regionLabel || "Catalunya"}`,
    description: `Rss ${SITE_NAME} de ${
      townLabel || regionLabel || "Catalunya"
    }`,
    copyright: SITE_NAME,
    updated: items.length > 0 ? new Date(items[0].startDate) : new Date(),
    author: {
      name: SITE_NAME,
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
    const description = `${item.title}\n\n🗓️ ${item.nameDay} ${item.formattedStart}\n\n🏡 ${item.location}, ${item.town}, ${item.region} \n\nℹ️ Més informació disponible a la nostra pàgina web!`;

    feed.addItem({
      id: item.id,
      title: item.title,
      link: `${siteUrl}/e/${item.slug}`,
      description,
      content: item.mapsLocation,
      date: new Date(item.startDate),
      image: selectImage(item),
    });
  });

  return feed;
};

export const getServerSideProps = async (context) => {
  if (context && context.res) {
    const { res, query } = context;

    // Extract region and town from query parameters
    const { region, town, maxEventsPerDay } = query;

    const articles = await getAllArticles(region, town, maxEventsPerDay);

    const feed = buildFeed(articles, region, town);
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
