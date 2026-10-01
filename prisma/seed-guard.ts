/**
 * Safety gate for the destructive database seed.
 *
 * `prisma/seed.ts` truncates every CMS table and re-inserts demo content. It is
 * registered as the Prisma seed (`prisma7.config.ts`), so the routine command
 * `npx prisma db seed` is enough to destroy all live site content. Nothing in
 * the script used to distinguish a scratch database from a production one: the
 * only input was `DATABASE_URL`, and the tables it clears are exactly the ones
 * the admin CMS writes to.
 *
 * This module makes that command refuse by default. It is a separate module
 * rather than a function inside the seed so the gate can be unit tested — the
 * seed executes `main()` at import time, so importing it from a test would
 * open a real database connection.
 */

/** The subset of the environment the guard reads. Injected so it stays testable. */
export type SeedEnvironment = {
  readonly DATABASE_URL: string | undefined;
  readonly NODE_ENV: string | undefined;
  readonly ALLOW_DESTRUCTIVE_SEED: string | undefined;
};

/**
 * A database the seed has been authorised to truncate.
 *
 * Returning the connection string as well as the hostname stops the caller from
 * re-deriving the DSN from the environment: reaching here already proved it is
 * present, non-empty, and parseable.
 */
export type SeedTarget = {
  /** Lowercase hostname, safe to print — it carries no credentials. */
  readonly host: string;
  readonly connectionString: string;
};

/**
 * Hostname suffixes of managed Postgres providers.
 *
 * These are matched against the parsed hostname rather than the raw
 * `DATABASE_URL` so that credentials embedded in the DSN never reach a log line
 * or an error message. Matching the hostname also keeps the check working when
 * the provider hands out several hostnames, which Supabase does: a direct host,
 * a session-mode pooler host, and a transaction-mode pooler host.
 *
 * This list is a backstop, not proof. A managed database addressed by bare IP
 * (`postgresql://user:pw@34.120.1.2:5432/db`) is indistinguishable from a
 * self-hosted one, so no hostname denylist can catch it; such a run is
 * authorised by gates 2 and 3 alone.
 */
const MANAGED_PRODUCTION_SUFFIXES: readonly string[] = [
  ".supabase.co",
  ".supabase.com",
  ".neon.tech",
  ".rds.amazonaws.com",
  ".database.windows.net",
];

/**
 * Hostname labels that mark a production deployment.
 *
 * A provider denylist alone is not enough, because a self-hosted production
 * database is usually named after its environment — `db.prod.internal`,
 * `prod-primary.example.com`. A label is treated as production when it is
 * `prod`/`production` optionally followed by a delimiter and a suffix, which
 * covers `prod`, `prod-1`, `prod_primary` and `production-db` while leaving
 * innocent hosts such as `products.example.com` alone.
 */
const PRODUCTION_HOST_LABEL = /^(?:prod|production)(?:[-_].*)?$/;

/**
 * Parses the hostname out of a PostgreSQL connection string.
 *
 * Returns `undefined` when the value is not a parseable URL. The caller treats
 * that as a refusal: a DSN this guard cannot understand is a DSN whose blast
 * radius it cannot bound, so it must not be treated as safe.
 */
export function parseDatabaseHost(connectionString: string): string | undefined {
  let url: URL;

  try {
    url = new URL(connectionString);
  } catch {
    return undefined;
  }

  return url.hostname === "" ? undefined : url.hostname.toLowerCase();
}

/** Reports whether a hostname is a known managed production endpoint. */
function isManagedProductionHost(host: string): boolean {
  return MANAGED_PRODUCTION_SUFFIXES.some((suffix) => host.endsWith(suffix));
}

/** Reports whether any dot-separated label of the host names a production env. */
function hasProductionHostLabel(host: string): boolean {
  return host.split(".").some((label) => PRODUCTION_HOST_LABEL.test(label));
}

/**
 * Throws unless it is safe to run the destructive seed.
 *
 * Four independent gates, each of which alone is enough to stop the seed:
 *
 * 1. `DATABASE_URL` must be present and parseable.
 * 2. `NODE_ENV` must not be `production`.
 * 3. `ALLOW_DESTRUCTIVE_SEED` must be exactly `"1"`, so running the seed is
 *    always a deliberate act rather than a side effect of another command.
 * 4. The hostname must not look like a production database.
 *
 * Gate 4 exists because gate 3 is not sufficient on its own. `NODE_ENV` is
 * frequently unset in a local shell, and a production `DATABASE_URL` is often
 * present in `.env` — so an operator who has once set the opt-in flag in a
 * dotenv file would clear production on every later run, including from a
 * terminal that never sets `NODE_ENV`.
 *
 * @returns the hostname and connection string the seed may truncate.
 * @throws {Error} with an actionable message when the run is refused.
 */
export function assertDestructiveSeedAllowed(env: SeedEnvironment): SeedTarget {
  const connectionString = env.DATABASE_URL;

  if (connectionString === undefined || connectionString === "") {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env first, then re-run.",
    );
  }

  if (env.NODE_ENV === "production") {
    throw new Error(
      "Refusing to seed: NODE_ENV is \"production\". The seed truncates every " +
        "content table, so it is never valid against a production deployment. " +
        "Run it against a local database instead.",
    );
  }

  if (env.ALLOW_DESTRUCTIVE_SEED !== "1") {
    throw new Error(
      "Refusing to seed: this script DELETEs all rows in 14 content tables " +
        "before re-inserting demo data. To confirm you mean it, re-run with " +
        "ALLOW_DESTRUCTIVE_SEED=1 set in the environment.",
    );
  }

  const host = parseDatabaseHost(connectionString);

  if (host === undefined) {
    throw new Error(
      "Refusing to seed: DATABASE_URL is not a parseable connection string, so " +
        "the target host cannot be checked against the production denylist.",
    );
  }

  if (isManagedProductionHost(host) || hasProductionHostLabel(host)) {
    throw new Error(
      `Refusing to seed: "${host}" looks like a production database. The seed ` +
        "truncates every content table, so pointing it at a managed production " +
        "endpoint is refused even with ALLOW_DESTRUCTIVE_SEED=1. Use a local or " +
        "disposable database instead.",
    );
  }

  return { host, connectionString };
}
