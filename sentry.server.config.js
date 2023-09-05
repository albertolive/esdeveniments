import { init } from "@sentry/nextjs";

const isProduction = process.env.NODE_ENV === "production";

init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: isProduction ? 0.1 : 1.0,
  environment: process.env.NODE_ENV,
  enabled: isProduction,
});
