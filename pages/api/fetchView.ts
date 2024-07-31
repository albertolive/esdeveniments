import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();

export const config = {
  runtime: "edge",
};

export default async function fetchView(req) {
  const body = await req.json();
  const slug = body.slug || req.query.slug;

  if (!slug) {
    return new NextResponse("Slug not found", { status: 400 });
  }

  const views = await redis.get(["pageviews", "projects", slug].join(":"));

  return new NextResponse(JSON.stringify({ views }));
}
