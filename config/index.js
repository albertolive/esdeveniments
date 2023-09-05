let siteUrl = process.env.VERCEL_URL;
if (siteUrl) siteUrl = `https://${siteUrl}`;
else siteUrl = "http://localhost:8081";

export { siteUrl };
