const siteUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
      process.env.NEXT_PUBLIC_VERCEL_ENV === "development"
    ? "https://esdeveniments.vercel.app"
    : "https://www.esdeveniments.cat";

export { siteUrl };
