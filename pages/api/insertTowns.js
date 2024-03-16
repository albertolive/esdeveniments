import axios from "axios";
import { siteUrl } from "@config/index";

async function fetchDataForTown(url) {
  const town = new URL(url).searchParams.get("town");
  const region = new URL(url).searchParams.get("region");
  try {
    console.log(`Fetching data for town ${town} in region ${region}`);
    await axios.get(url);
    console.log(`Fetched data for town ${town} in region ${region}`);
  } catch (error) {
    console.error(
      `Error fetching data for town ${town} in region ${region}: ${error}`
    );
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const getTownsUrl = `${siteUrl}/api/getTowns`;
    const { data: urls } = await axios.get(getTownsUrl);

    for (const url of urls) {
      await fetchDataForTown(url);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const removeDuplicatesUrl = `${siteUrl}/api/removeDuplicates`;
    await axios.get(removeDuplicatesUrl);
    console.log("Duplicates removed successfully");

    res
      .status(200)
      .json({ message: "Data fetched and duplicates removed successfully" });
  } catch (error) {
    console.error(`Error during operation: ${error}`);
    res.status(500).json({ error: "Failed to complete the operation" });
  }
}
