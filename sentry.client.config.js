import { init } from "@sentry/nextjs";
import { BrowserTracing } from "@sentry/tracing";
import { Replay } from "@sentry/replay";

const isProduction = process.env.NODE_ENV === "production";

init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DNS,
  integrations: [new BrowserTracing(), new Replay()],
  tracesSampleRate: isProduction ? 0.1 : 1.0,
  replaysSessionSampleRate: isProduction ? 0.1 : 1.0,
  replaysOnErrorSampleRate: isProduction ? 0.1 : 1.0,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV,
  enabled: isProduction,
});
