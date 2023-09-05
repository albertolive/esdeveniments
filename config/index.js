const siteUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : process.env.VERCEL_ENV === "preview" ||
      process.env.VERCEL_ENV === "development"
    ? "https://esdeveniments.vercel.app"
    : "https://www.esdeveniments.cat";
console.log("VERCEL_ENV", process.env.VERCEL_ENV);
export { siteUrl };
