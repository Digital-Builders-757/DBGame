// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Determine which Sentry DSN to use based on environment
const isProduction = process.env.VERCEL_ENV === "production";

// Production DSN (from environment variable)
const PRODUCTION_DSN = process.env.SENTRY_DSN_PROD;

// Development DSN (from environment variable)
// Must be set in .env.local for local development
const DEVELOPMENT_DSN = process.env.SENTRY_DSN_DEV;

// Select the appropriate DSN
// Prefer production DSN in production, otherwise use development DSN
// If neither is set, Sentry will be disabled (no errors thrown)
const SENTRY_DSN = isProduction && PRODUCTION_DSN 
  ? PRODUCTION_DSN 
  : DEVELOPMENT_DSN;

// Warn if Sentry is not configured (only in development)
if (process.env.NODE_ENV === "development" && !SENTRY_DSN) {
  console.warn("[Sentry Edge] ⚠️ Sentry DSN not configured. Set SENTRY_DSN_DEV in .env.local for error tracking.");
}

Sentry.init({
  dsn: SENTRY_DSN,

  // Adjust sample rate based on environment
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Set environment
  environment: process.env.VERCEL_ENV || "development",

  // Enable logs to be sent to Sentry (disabled in production to reduce noise)
  enableLogs: process.env.NODE_ENV !== "production",

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false, // Set to false for privacy in production

  // Ignore common errors
  ignoreErrors: [
    "NEXT_NOT_FOUND", 
    "NEXT_REDIRECT",
    "EPIPE", // Ignore broken pipe errors from stdout/dev server
    "write EPIPE", // Ignore write errors from dev server logging
  ],

  // Filter out non-critical system errors before sending to Sentry
  beforeSend(event, hint) {
    const error = hint.originalException;

    // Filter out EPIPE errors (broken pipe from stdout/stderr)
    if (error && typeof error === 'object') {
      const errorObj = error as any;
      
      // Check for EPIPE system errors
      if (errorObj.code === 'EPIPE' || errorObj.errno === -32) {
        return null; // Don't send to Sentry
      }

      // Check for EPIPE in error message
      if (errorObj.message && typeof errorObj.message === 'string' && errorObj.message.includes('EPIPE')) {
        return null; // Don't send to Sentry
      }

      // Check for Next.js dev server logging errors (broader check)
      if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
        frame => frame.filename?.includes('log-requests.js') ||
                 frame.filename?.includes('build/output/log.js') ||
                 frame.filename?.includes('console-dev.js')
      )) {
        return null; // Don't send to Sentry - dev server logging issue
      }
    }

    return event;
  },
});
