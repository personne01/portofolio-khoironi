import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/lib/generated/prisma/client";

/**
 * Forces every pooled connection's PostgreSQL session timezone to UTC.
 *
 * `@prisma/adapter-pg` decodes `timestamptz` columns from the wall-clock text
 * PostgreSQL sends, ignoring the offset that text carries. On a session running
 * in a non-UTC zone the decoded `Date` is shifted by that offset — measured at
 * exactly +7h under `Asia/Jakarta`. Writes are skewed the same way in reverse,
 * so a value written and read back through Prisma looks self-consistent while
 * both halves sit hours away from the true instant. In `admin_sessions` that
 * turned the `expiresAt <= Date.now()` guard into a multi-hour grace window.
 *
 * Pinning the session to UTC removes the offset from the text entirely, so the
 * lossy decode becomes a no-op and Prisma agrees with `pg` and psql.
 */
const SESSION_OPTIONS = "-c timezone=UTC";

/**
 * Creates a Prisma client bound to the `pg` driver adapter.
 *
 * A driver adapter is required here: Prisma 7's default engine expects a
 * Rust query engine binary, while `@prisma/adapter-pg` routes every query
 * through the plain `pg` package. That keeps the deployment footprint
 * JavaScript-only.
 */
function createPrismaClient(): PrismaClient {
  const connectionString = process.env["DATABASE_URL"];

  if (connectionString === undefined || connectionString === "") {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and point it at a PostgreSQL database.",
    );
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString, options: SESSION_OPTIONS }),
  });
}

/**
 * Next.js re-evaluates modules on every edit in development. Caching the
 * instance on `globalThis` stops each hot reload from opening a brand new
 * connection pool, which would otherwise exhaust PostgreSQL's max_connections.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env["NODE_ENV"] !== "production") {
  globalForPrisma.prisma = db;
}
