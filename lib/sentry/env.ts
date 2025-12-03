// Fallback DSN - should be replaced with actual Digital Builders Sentry project DSN
// Set SENTRY_DSN_DEV or SENTRY_DSN_PROD in .env.local to configure Sentry
const FALLBACK_DSN = process.env.SENTRY_DSN_DEV || process.env.SENTRY_DSN_PROD || null;

const nodeEnv = process.env.NODE_ENV ?? "development";
const clientVercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
const serverVercelEnv = process.env.VERCEL_ENV;
const isProduction = nodeEnv === "production" || clientVercelEnv === "production";
const serverIsProduction = nodeEnv === "production" || serverVercelEnv === "production";

const sharedPublicDSN =
  process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN ?? null;

const productionDSN =
  process.env.SENTRY_DSN_PROD ??
  process.env.NEXT_PUBLIC_SENTRY_DSN_PROD ??
  sharedPublicDSN ??
  null;

const developmentDSN =
  process.env.SENTRY_DSN_DEV ??
  process.env.NEXT_PUBLIC_SENTRY_DSN_DEV ??
  sharedPublicDSN ??
  null;

const currentDSN = isProduction
  ? productionDSN ?? developmentDSN ?? FALLBACK_DSN
  : developmentDSN ?? productionDSN ?? FALLBACK_DSN;

// Expected project ID from environment variable (set when Sentry project is created)
const expectedProjectId = process.env.SENTRY_PROJECT_ID || null;
const currentProjectId = currentDSN ? parseProjectId(currentDSN) : null;
const projectIdMatches = expectedProjectId ? currentProjectId === expectedProjectId : true;

function parseProjectId(dsn: string): string | null {
  const match = dsn.match(/\/(\d+)(?:\?|$)/);
  return match ? match[1] : null;
}

export {
  currentDSN,
  currentProjectId,
  expectedProjectId,
  productionDSN,
  developmentDSN,
  isProduction,
  serverIsProduction,
  nodeEnv,
  projectIdMatches,
  parseProjectId,
  FALLBACK_DSN,
};

