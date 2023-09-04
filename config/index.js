const siteUrl =
  process.env.NODE_ENV !== "production" ||
  process.env.VERCEL_ENV !== "production"
    ? "http://localhost:3000"
    : `https://${process.env.VERCEL_URL}`;

export { siteUrl };
