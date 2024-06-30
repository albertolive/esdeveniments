import axios from "axios";
import { CITIES_DATA } from "@utils/cityData";
import { captureException } from "@sentry/nextjs";

function generateTownUrls(province) {
  const baseUrl = `https://www.esdeveniments.cat/api/fetchRss`;
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
    console.log(`Processing ${town} in ${region}`);
    const response = await axios.get(url, {
      timeout: 30000, // 30 second timeout
    });
    console.log(`Processed ${town} in ${region}`);
    return { success: true, town, region, data: response.data };
  } catch (error) {
    console.error(`Error processing ${town} in ${region}: ${error.message}`);
    captureException(error, {
      extra: {
        town,
        region,
        url,
      },
    });
    return { success: false, error: error.message, town, region };
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { province } = req.query;
  const concurrencyLimit = parseInt(req.query.concurrency) || 5; // Reduced default concurrency

  const startTime = Date.now();
  const timeLimit = 4.5 * 60 * 1000; // 4.5 minutes in milliseconds

  try {
    const urls = generateTownUrls(province);
    console.log(
      `Processing ${urls.length} towns for province: ${province || "all"}`
    );

    const results = [];
    let processed = 0;

    while (processed < urls.length) {
      const remainingTime = timeLimit - (Date.now() - startTime);
      if (remainingTime <= 0) {
        console.warn("Time limit reached. Stopping further processing.");
        break;
      }

      const chunk = urls.slice(processed, processed + concurrencyLimit);
      const chunkResults = await Promise.all(chunk.map(processTown));

      results.push(...chunkResults);

      processed += chunk.length;
      console.log(
        `Processed ${processed}/${urls.length} towns (${(
          (processed / urls.length) *
          100
        ).toFixed(2)}%)`
      );
    }

    const totalTime = (Date.now() - startTime) / 1000;
    console.log(`Operation completed in ${totalTime.toFixed(2)} seconds`);

    const successes = results.filter((r) => r.success);
    const errors = results.filter((r) => !r.success);

    const summary = {
      message:
        processed === urls.length
          ? "All towns processed"
          : "Partial towns processed (time limit reached)",
      province: province || "all",
      totalTowns: urls.length,
      townsProcessed: processed,
      successCount: successes.length,
      errorCount: errors.length,
      processingTime: totalTime,
      errors: errors.map((e) => ({
        town: e.town,
        region: e.region,
        error: e.error,
      })),
    };

    console.log("Operation summary:", JSON.stringify(summary, null, 2));

    res.status(200).json(summary);
  } catch (error) {
    console.error(`Error during operation: ${error}`);
    captureException(error);
    res.status(500).json({
      error: "Failed to complete the operation",
      province: province || "all",
      details: error.message,
    });
  }
}
