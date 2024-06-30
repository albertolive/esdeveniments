import axios from "axios";
import { CITIES_DATA } from "@utils/constants";
import { captureException } from "@sentry/nextjs";
import { siteUrl } from "@config/index";

function generateTownUrls(province) {
  const baseUrl = `${siteUrl}/api/fetchRss`;
  return Array.from(CITIES_DATA.entries())
    .filter(([, regionData]) => !province || regionData.province === province)
    .flatMap(([region, regionData]) =>
      Array.from(regionData.towns.keys()).map(
        (town) =>
          `${baseUrl}?region=${encodeURIComponent(
            region
          )}&town=${encodeURIComponent(town)}`
      )
    );
}

async function processTown(url) {
  const { town, region } = Object.fromEntries(new URL(url).searchParams);
  try {
    await axios.get(url, { timeout: 10000 });
    return { success: true, town, region };
  } catch (error) {
    captureException(error, { extra: { town, region, url } });
    return { success: false, error: error.message, town, region };
  }
}

async function processInBatches(urls, batchSize, startTime, timeLimit) {
  const results = [];
  for (let i = 0; i < urls.length; i += batchSize) {
    if (Date.now() - startTime > timeLimit) break;
    const batch = urls.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processTown));
    results.push(...batchResults);
  }
  return results;
}

function generateSummary(urls, results, totalTime) {
  const processed = results.length;
  const successes = results.filter((r) => r.success);
  const errors = results.filter((r) => !r.success);

  return {
    message:
      processed === urls.length
        ? "All towns processed"
        : "Partial towns processed (time limit reached)",
    totalTowns: urls.length,
    townsProcessed: processed,
    percentageProcessed: ((processed / urls.length) * 100).toFixed(2) + "%",
    successCount: successes.length,
    errorCount: errors.length,
    processingTime: totalTime.toFixed(2),
    errors: errors.map((e) => ({
      town: e.town,
      region: e.region,
      error: e.error,
    })),
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { province } = req.query;
  const startTime = Date.now();
  const timeLimit = 4.5 * 60 * 1000; // 4.5 minutes in milliseconds
  const batchSize = 5; // Process 5 towns concurrently

  const urls = generateTownUrls(province);

  let results = [];

  try {
    results = await processInBatches(urls, batchSize, startTime, timeLimit);
  } catch (error) {
    captureException(error);
  } finally {
    const totalTime = (Date.now() - startTime) / 1000;

    const summary = generateSummary(urls, results, totalTime);

    res.status(200).json(summary);
  }
}
