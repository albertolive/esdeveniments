import { generateTownUrls } from "@utils/helpers";

const handler = async (req, res) => {
  try {
    // Extract region from query parameters
    const { region } = req.query;

    const townsUrls = generateTownUrls(region);

    res.setHeader("Cache-Control", "public, max-age=86400, immutable");
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(townsUrls);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while generating town URLs." });
  }
};

export default handler;
