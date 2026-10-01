import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Regression guard for the PostgreSQL session timezone.
 *
 * `@prisma/adapter-pg` decodes `timestamptz` from the wall-clock text
 * PostgreSQL sends and drops the offset that text carries, shifting every
 * decoded `Date` by the session zone offset (+7h under `Asia/Jakarta`, as
 * measured against `pg` and psql). Because writes are skewed the same way in
 * reverse, a value written and read back through Prisma looks self-consistent
 * while sitting hours from the true instant -- which turned the
 * `admin_sessions.expiresAt` guard into a multi-hour grace window.
 *
 * These tests assert the connection stays pinned to UTC. They do not need a
 * live database: the defect is in adapter configuration, not in query logic.
 */

type PgConfig = { connectionString?: string; options?: string };

const captured: { pgConfig: PgConfig | undefined } = { pgConfig: undefined };

vi.mock("@prisma/adapter-pg", () => ({
  PrismaPg: class {
    constructor(config: PgConfig) {
      captured.pgConfig = config;
    }
  },
}));

vi.mock("@/lib/generated/prisma/client", () => ({
  PrismaClient: class {},
}));

type PrismaGlobal = { prisma: unknown };
const globalForPrisma = globalThis as unknown as PrismaGlobal;

async function loadDbModule(): Promise<typeof import("@/lib/db")> {
  vi.resetModules();
  return await import("@/lib/db");
}

beforeEach(() => {
  delete globalForPrisma.prisma;
  captured.pgConfig = undefined;
  vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db");
  vi.stubEnv("NODE_ENV", "test");
});

afterEach(() => {
  delete globalForPrisma.prisma;
  vi.unstubAllEnvs();
});

describe("prisma connection", () => {
  it("pins the session to UTC so timestamptz values decode without an offset shift", async () => {
    await loadDbModule();

    expect(captured.pgConfig).toBeDefined();
    expect(captured.pgConfig?.options).toContain("timezone=UTC");
  });

  it("passes the configured connection string through unchanged", async () => {
    await loadDbModule();

    expect(captured.pgConfig?.connectionString).toBe("postgresql://user:pass@localhost:5432/db");
  });

  it("refuses to construct a client without DATABASE_URL", async () => {
    vi.stubEnv("DATABASE_URL", "");

    await expect(loadDbModule()).rejects.toThrow(/DATABASE_URL/);
  });
});
