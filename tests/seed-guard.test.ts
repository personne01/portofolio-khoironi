import { describe, expect, it } from "vitest";

import {
  assertDestructiveSeedAllowed,
  parseDatabaseHost,
} from "@/prisma/seed-guard";

/**
 * Regression guard for the destructive database seed.
 *
 * `prisma/seed.ts` truncates 14 content tables with unfiltered `deleteMany()`
 * calls and is wired as the default Prisma seed, so the routine command
 * `npx prisma db seed` used to be enough to erase all live site content. The
 * only input it consulted was `DATABASE_URL`, with no check on whether the
 * target was a scratch database or the live one.
 *
 * These tests pin the opt-in gate closed. They need no live database: the
 * blast radius is decided entirely by environment and hostname, before any
 * client is constructed, so the cases below are pure.
 */

const LOCAL = "postgresql://postgres:postgres@localhost:5432/portfolio?schema=public";
const SUPABASE_POOLER =
  "postgresql://postgres.projectref:hunter2@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres";

function optIn(overrides: {
  DATABASE_URL?: string;
  NODE_ENV?: string;
  ALLOW_DESTRUCTIVE_SEED?: string;
} = {}) {
  return {
    DATABASE_URL: LOCAL,
    NODE_ENV: "development",
    ALLOW_DESTRUCTIVE_SEED: "1",
    ...overrides,
  };
}

describe("parseDatabaseHost", () => {
  it("extracts the hostname from a DSN", () => {
    expect(parseDatabaseHost(LOCAL)).toBe("localhost");
    expect(parseDatabaseHost(SUPABASE_POOLER)).toBe(
      "aws-0-ap-northeast-1.pooler.supabase.com",
    );
  });

  it("lowercases the host so the denylist cannot be evaded by casing", () => {
    expect(
      parseDatabaseHost("postgresql://u:p@DB.EXAMPLE.COM:5432/db"),
    ).toBe("db.example.com");
  });

  it("returns undefined for an unparseable value", () => {
    expect(parseDatabaseHost("")).toBeUndefined();
    expect(parseDatabaseHost("not-a-dsn")).toBeUndefined();
  });
});

describe("assertDestructiveSeedAllowed", () => {
  it("returns the target for an opted-in local database", () => {
    const target = assertDestructiveSeedAllowed(optIn());

    expect(target.host).toBe("localhost");
    expect(target.connectionString).toBe(LOCAL);
  });

  it("refuses when DATABASE_URL is missing", () => {
    expect(() => assertDestructiveSeedAllowed(optIn({ DATABASE_URL: undefined })))
      .toThrow(/DATABASE_URL is not set/);
  });

  it("refuses when DATABASE_URL is empty", () => {
    expect(() => assertDestructiveSeedAllowed(optIn({ DATABASE_URL: "" })))
      .toThrow(/DATABASE_URL is not set/);
  });

  it("refuses when NODE_ENV is production, even with the opt-in flag set", () => {
    expect(() => assertDestructiveSeedAllowed(optIn({ NODE_ENV: "production" })))
      .toThrow(/NODE_ENV is "production"/);
  });

  it("refuses when the opt-in flag is absent", () => {
    expect(() =>
      assertDestructiveSeedAllowed(optIn({ ALLOW_DESTRUCTIVE_SEED: undefined })),
    ).toThrow(/ALLOW_DESTRUCTIVE_SEED=1/);
  });

  it("refuses when the opt-in flag is set to anything but exactly \"1\"", () => {
    // Truthy-but-wrong values are the realistic footgun: an operator sets
    // ALLOW_DESTRUCTIVE_SEED=true, sees no error, and expects it to have armed.
    for (const value of ["true", "yes", "0", "11", " 1", "1 ", ""]) {
      expect(() =>
        assertDestructiveSeedAllowed(optIn({ ALLOW_DESTRUCTIVE_SEED: value })),
      ).toThrow(/ALLOW_DESTRUCTIVE_SEED=1/);
    }
  });

  it("refuses a managed production host even when fully opted in", () => {
    expect(() =>
      assertDestructiveSeedAllowed(optIn({ DATABASE_URL: SUPABASE_POOLER })),
    ).toThrow(/looks like a production database/);
  });

  it("refuses a production-labelled host even when it is not a known provider", () => {
    // Gate 4 must not be reducible to a provider denylist: a self-hosted
    // production box is usually named after its environment.
    for (const dsn of [
      "postgresql://u:p@db.prod.internal:5432/app",
      "postgresql://u:p@prod-primary.example.com:5432/app",
      "postgresql://u:p@aws-0-eu-west-1.rds.amazonaws.com:5432/app",
    ]) {
      expect(() =>
        assertDestructiveSeedAllowed(optIn({ DATABASE_URL: dsn })),
      ).toThrow(/looks like a production database/);
    }
  });

  it("does not refuse a host that merely shares a prefix with the keyword", () => {
    // `products` and `productivity` share a prefix with `prod` but are not
    // environment labels. A gate that refused them would be disabled by users
    // in practice, so the pattern must require a delimiter after the keyword.
    for (const host of ["products.example.com", "productivity.dev"]) {
      const target = assertDestructiveSeedAllowed(
        optIn({ DATABASE_URL: `postgresql://u:p@${host}:5432/app` }),
      );

      expect(target.host).toBe(host);
    }
  });

  it("refuses an unparseable DSN instead of guessing it is safe", () => {
    expect(() =>
      assertDestructiveSeedAllowed(optIn({ DATABASE_URL: "garbage" })),
    ).toThrow(/not a parseable connection string/);
  });

  it("refuses a hostname-less socket DSN, which covers Cloud SQL", () => {
    // Cloud SQL's documented socket form has no host component at all, so the
    // host is empty and the run is refused before it can reach the database.
    expect(() =>
      assertDestructiveSeedAllowed(
        optIn({
          DATABASE_URL: "postgresql://u:p@/dbname?host=/cloudsql/INSTANCE",
        }),
      ),
    ).toThrow(/not a parseable connection string/);
  });

  it("cannot distinguish a managed database addressed by bare IP", () => {
    // Documented limitation, asserted so the boundary stays visible: a bare-IP
    // DSN carries no provider identity, leaving gates 2 and 3 as the only
    // protection. If IP-based detection is ever added, this test must change.
    const target = assertDestructiveSeedAllowed(
      optIn({ DATABASE_URL: "postgresql://u:p@34.120.1.2:5432/app" }),
    );

    expect(target.host).toBe("34.120.1.2");
  });

  it("never echoes the password into a refusal message", () => {
    // A refusal is the message most likely to be pasted into a bug report, so
    // it must not carry the inline credential it is refusing to touch.
    let message = "";

    try {
      assertDestructiveSeedAllowed(optIn({ DATABASE_URL: SUPABASE_POOLER }));
    } catch (error) {
      message = error instanceof Error ? error.message : String(error);
    }

    expect(message).not.toContain("hunter2");
    expect(message).toContain("pooler.supabase.com");
  });

  it("does not treat a production host as safe just because the flag is absent", () => {
    // Guards the ordering of the gates: a missing flag must be enough on its
    // own, and must not be short-circuited into the host check succeeding.
    expect(() =>
      assertDestructiveSeedAllowed({
        DATABASE_URL: SUPABASE_POOLER,
        NODE_ENV: "development",
        ALLOW_DESTRUCTIVE_SEED: undefined,
      }),
    ).toThrow(/ALLOW_DESTRUCTIVE_SEED=1/);
  });
});
