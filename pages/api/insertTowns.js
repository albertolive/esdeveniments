import axios from "axios";
import { CITIES_DATA } from "@utils/constants";
import { captureException } from "@sentry/nextjs";
import { siteUrl } from "@config/index";

function generateTownUrls(province) {
  console.log(
    `[${new Date().toISOString()}] Generating town URLs for province: ${
      province || "all"
    }`
  );
  const baseUrl = `${siteUrl}/api/fetchRss`;
  const urls = Array.from(CITIES_DATA.entries())
    .filter(([, regionData]) => !province || regionData.province === province)
    .flatMap(([region, regionData]) =>
      Array.from(regionData.towns.keys()).map(
        (town) =>
          `${baseUrl}?region=${encodeURIComponent(
            region
          )}&town=${encodeURIComponent(town)}`
      )
    );
  console.log(`[${new Date().toISOString()}] Generated ${urls.length} URLs`);
  return urls;
}

async function processTown(url) {
  const { town, region } = Object.fromEntries(new URL(url).searchParams);
  console.log(
    `[${new Date().toISOString()}] Processing town: ${town}, region: ${region}`
  );
  try {
    await axios.get(url, { timeout: 10000 });
    console.log(
      `[${new Date().toISOString()}] Successfully processed ${town}, ${region}`
    );
    return { success: true, town, region };
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error processing ${town}, ${region}: ${
        error.message
      }`
    );
    captureException(error, { extra: { town, region, url } });
    return { success: false, error: error.message, town, region };
  }
}

async function processInBatches(urls, batchSize, startTime, timeLimit) {
  console.log(
    `[${new Date().toISOString()}] Starting batch processing. Total URLs: ${
      urls.length
    }, Batch size: ${batchSize}`
  );
  const results = [];
  for (let i = 0; i < urls.length; i += batchSize) {
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime > timeLimit) {
      console.log(
        `[${new Date().toISOString()}] Time limit reached. Stopping processing.`
      );
      break;
    }
    console.log(
      `[${new Date().toISOString()}] Processing batch ${
        Math.floor(i / batchSize) + 1
      }. URLs ${i + 1} to ${Math.min(i + batchSize, urls.length)}`
    );
    const batch = urls.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processTown));
    results.push(...batchResults);
    console.log(
      `[${new Date().toISOString()}] Batch ${
        Math.floor(i / batchSize) + 1
      } completed. Total processed: ${results.length}`
    );
  }
  return results;
}

function generateSummary(urls, results, totalTime) {
  console.log(`[${new Date().toISOString()}] Generating summary`);
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
  console.log(`[${new Date().toISOString()}] Handler function started`);
  if (req.method !== "GET") {
    console.log(`[${new Date().toISOString()}] Invalid method: ${req.method}`);
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { province } = req.query;
  const startTime = Date.now();
  const timeLimit = 4.5 * 60 * 1000; // 4.5 minutes in milliseconds
  const batchSize = 5; // Process 5 towns concurrently

  console.log(
    `[${new Date().toISOString()}] Configuration: Province: ${
      province || "all"
    }, Time limit: ${timeLimit}ms, Batch size: ${batchSize}`
  );

  const urls = generateTownUrls(province);

  let results = [];

  try {
    console.log(`[${new Date().toISOString()}] Starting batch processing`);
    results = await processInBatches(urls, batchSize, startTime, timeLimit);
    console.log(
      `[${new Date().toISOString()}] Batch processing completed. Total results: ${
        results.length
      }`
    );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error during batch processing: ${
        error.message
      }`
    );
    captureException(error);
  } finally {
    const totalTime = (Date.now() - startTime) / 1000;
    console.log(
      `[${new Date().toISOString()}] Processing completed. Total time: ${totalTime.toFixed(
        2
      )} seconds`
    );

    const summary = generateSummary(urls, results, totalTime);
    console.log(
      `[${new Date().toISOString()}] Summary generated`,
      JSON.stringify(summary, null, 2)
    );

    res.status(200).json(summary);
    console.log(
      `[${new Date().toISOString()}] Response sent. Handler function completed.`
    );
  }
}
