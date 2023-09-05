let siteUrl = process.env.VERCEL_URL;
if (siteUrl) siteUrl = `https://${vc}`;
else siteUrl = "http://localhost:8081";

export { siteUrl };
