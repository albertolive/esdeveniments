import "server-only";
import { createClient } from "@redis/client";

/**
 * App-level Redis cache, deliberately separate from the Next.js incremental
 * cache handler (cache-handler.mjs). That handler namespaces every key by
 * buildId, so its entries are dropped on each deploy — correct for prerender
 * shells, wrong for data we want to outlive deploys (e.g. Google Places
 * results). This client uses stable, unprefixed keys.
 *
 * Fails open: any connection or command error resolves to null / no-op so the
 * caller falls back to the origin. It never throws into the request path.
 */

/** Back off this long after a failure so a Redis outage can't trigger a connect attempt on every request. */
const FAILURE_COOLDOWN_MS = 30_000;

/** Wall-clock bound on a single Redis command. node-redis clears its own
 * abortSignal/timeout listeners once a command is written to the socket, so
 * those do NOT bound an in-flight reply — a plain Promise.race does. */
const COMMAND_TIMEOUT_MS = 1_000;

/**
 * Race a Redis command against a wall-clock timeout so a connected-but-slow
 * server can't hang the request path. node-redis's abortSignal/timeout options
 * are removed when the command is written, so a delayed reply is never settled
 * by them. Racing against a timer settles with `fallback` regardless, and
 * stamps the failure cooldown so the slow server is skipped for the next window.
 */
async function raceWithTimeout<T>(
  command: Promise<T>,
  fallback: T,
  ms: number
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      globalForRedis.__appRedisFailedAt = Date.now();
      resolve(fallback);
    }, ms);
  });
  try {
    return await Promise.race([command, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

const globalForRedis = globalThis as unknown as {
  __appRedis?: Promise<ReturnType<typeof createClient> | null>;
  __appRedisFailedAt?: number;
};

/** Mirrors cache-handler.mjs so both layers resolve Redis the same way. */
function getRedisUrl(): string | null {
  if (process.env.REDIS_URL?.trim()) return process.env.REDIS_URL;

  const host = process.env.REDIS_HOST;
  if (!host) return null;

  const port = process.env.REDIS_PORT || "6379";
  const password = process.env.REDIS_PASSWORD;
  const username = process.env.REDIS_USERNAME;
  const auth = password
    ? `${username ? encodeURIComponent(username) : ""}:${encodeURIComponent(
        password
      )}@`
    : username
      ? `${encodeURIComponent(username)}@`
      : "";

  return `redis://${auth}${host}:${port}`;
}

async function getClient(): Promise<ReturnType<typeof createClient> | null> {
  // Fail open during the cooldown after any failure — checked before reusing a
  // cached client, so a client that errored *after* connecting is skipped too
  // (otherwise the cached promise would always short-circuit this check).
  if (
    globalForRedis.__appRedisFailedAt &&
    Date.now() - globalForRedis.__appRedisFailedAt < FAILURE_COOLDOWN_MS
  ) {
    return null;
  }

  if (globalForRedis.__appRedis) return globalForRedis.__appRedis;

  const url = getRedisUrl();
  if (!url) return null;

  const isTls = url.startsWith("rediss://");

  globalForRedis.__appRedis = (async () => {
    let client: ReturnType<typeof createClient> | null = null;
    try {
      client = createClient({
        url,
        pingInterval: 10_000,
        // Fail fast instead of queueing commands while disconnected, so a Redis
        // outage falls through to the origin immediately rather than hanging.
        disableOfflineQueue: true,
        socket: isTls
          ? { tls: true, rejectUnauthorized: false, connectTimeout: 2_000 }
          : { connectTimeout: 2_000 },
      });
      // node-redis needs a persistent error listener or it throws on errors.
      // It reconnects on its own, so we don't disconnect/recreate here — doing
      // that risked a late error from an old client wiping a newer one's
      // promise. We just stamp the failure (the cooldown check above uses it to
      // fail open) and log it so errors aren't silently swallowed.
      client.on("error", (err) => {
        globalForRedis.__appRedisFailedAt = Date.now();
        console.warn("[redis-cache] client error:", err?.message ?? err);
      });
      await client.connect();
      return client;
    } catch (error) {
      // Disconnect the failed client so it doesn't keep retrying in the
      // background — without this, each cooldown cycle during a prolonged
      // outage would orphan a new client. Log so a silent connect failure
      // (= running uncached, more paid Places calls) is noticeable.
      client?.disconnect().catch(() => {});
      console.warn("[redis-cache] connect failed:", error);
      globalForRedis.__appRedis = undefined;
      globalForRedis.__appRedisFailedAt = Date.now();
      return null;
    }
  })();

  return globalForRedis.__appRedis;
}

export async function cacheGetJson<T>(key: string): Promise<T | null> {
  try {
    const client = await getClient();
    if (!client) return null;
    const raw = await raceWithTimeout(client.get(key), null, COMMAND_TIMEOUT_MS);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function cacheSetJson(
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> {
  try {
    const client = await getClient();
    if (!client) return;
    // SETEX (dedicated helper) avoids the deprecated { EX } option and is
    // stable across redis v5/v6.
    await raceWithTimeout(
      client.setEx(key, ttlSeconds, JSON.stringify(value)),
      "",
      COMMAND_TIMEOUT_MS
    );
  } catch (error) {
    // best-effort: a failed cache write must never fail the request, but log
    // it so write failures aren't silently swallowed.
    console.warn("[redis-cache] set failed:", error);
  }
}
