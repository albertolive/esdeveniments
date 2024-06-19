import { captureException } from "@sentry/nextjs";
import { twoWeeksDefault } from "@lib/dates";
import { getCategorizedEvents, getLatestEvents } from "@lib/helpers";

const handler = async (req, res) => {
  const { searchTerms, maxResults } = req.query;

  const { from, until } = twoWeeksDefault();
  const searchTermsArray = searchTerms ? searchTerms.split(",") : [];

  try {
    const [categorizedResult, latestResult] = await Promise.allSettled([
      getCategorizedEvents({
        searchTerms: searchTermsArray,
        from,
        until,
        maxResults: parseInt(maxResults, 10),
        filterByDate: true,
      }),
      getLatestEvents({
        from,
        until,
        maxResults: parseInt(maxResults, 10),
        filterByDate: true,
      }),
    ]);

    const categorizedEvents =
      categorizedResult.status === "fulfilled" ? categorizedResult.value : {};
    const latestEvents =
      latestResult.status === "fulfilled" ? latestResult.value.events : [];

    res.setHeader("Cache-Control", "public, max-age=900, must-revalidate");
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      categorizedEvents,
      latestEvents,
      currentYear: new Date().getFullYear(),
      noEventsFound:
        Object.keys(categorizedEvents).length === 0 &&
        latestEvents.length === 0,
    });
  } catch (error) {
    console.error(error);
    captureException(new Error(`Error fetching categorized events: ${error}`));
    res.status(500).json({ error: "Error fetching events" });
  }
};

export default handler;
