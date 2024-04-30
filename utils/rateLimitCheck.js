const rateLimitWindowMs = 300;
const rateLimitCalls = 5;
let callTimestamps = [];

export function rateLimitCheck() {
  const now = Date.now();
  const windowLimit = now - rateLimitWindowMs;
  callTimestamps = callTimestamps.filter((ts) => ts > windowLimit);
  if (callTimestamps.length >= rateLimitCalls) {
    throw new Error("Rate limit exceeded");
  }
  callTimestamps.push(now);
}
