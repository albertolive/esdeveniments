import axios from "axios";
import { getAuthToken } from "@lib/auth";
import { captureException } from "@sentry/nextjs";

/**
 * Fetches keyword performance data from Google Search Console.
 *
 * @param {string} siteUrl - The URL of the site to query.
 * @param {string} startDate - The start date for the query in YYYY-MM-DD format.
 * @param {string} endDate - The end date for the query in YYYY-MM-DD format.
 * @returns {Promise<Array>} - An array of keyword performance data.
 */
export async function fetchKeywordPerformance(siteUrl, startDate, endDate) {
  try {
    const accessToken = await getAuthToken("webmasters.readonly");

    const response = await axios.post(
      `https://searchconsole.googleapis.com/v1/sites/${encodeURIComponent(
        siteUrl
      )}/searchAnalytics/query`,
      {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.rows || [];
  } catch (error) {
    const errorMessage = `Error fetching keyword performance data: ${
      error.response?.data?.error?.message || error.message
    }`;
    console.error(errorMessage);
    captureException(new Error(errorMessage));
    throw new Error("Failed to fetch keyword performance data.");
  }
}
