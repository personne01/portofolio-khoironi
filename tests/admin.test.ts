import { afterEach, describe, expect, it, vi } from "vitest";

import { hashPassword, verifyPassword } from "@/lib/admin/password";
import {
  ADMIN_SESSION_COOKIE,
  clearSessionCookie,
  generateSessionToken,
  hashSessionToken,
  readSessionTokenFromRequest,
  serializeSessionCookie,
  sessionCookieOptions,
  sessionTtlSeconds,
} from "@/lib/admin/session";
import { assertSameOrigin } from "@/lib/admin/csrf";
import {
  articleSchema,
  loginSchema,
  navLinkSchema,
  passwordHashSchema,
  passwordSaltSchema,
  projectSchema,
  sessionTokenHexSchema,
  skillSchema,
} from "@/lib/admin/schemas";
import { ApiError } from "@/lib/errors";

vi.mock("@/lib/db", () => ({ db: {} }));

const HEX_64 = /^[0-9a-f]{64}$/;
const HEX_128 = /^[0-9a-f]{128}$/;
const HEX_32 = /^[0-9a-f]{32}$/;

function requestWith(method: string, headers: Record<string, string>): Request {
  return new Request("http://localhost:3001/api/v1/admin/projects", { method, headers });
}

function expectApiError(fn: () => void, status: number, code: string): void {
  let thrown: unknown;
  try {
    fn();
  } catch (error) {
    thrown = error;
  }
  expect(thrown).toBeInstanceOf(ApiError);
  const apiError = thrown as ApiError;
  expect(apiError.status).toBe(status);
  expect(apiError.code).toBe(code);
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("hashPassword", () => {
  it("returns a 64-byte key and a 16-byte salt, both hex", async () => {
    const { hash, salt } = await hashPassword("SuperSecret12345");
    expect(hash).toMatch(HEX_128);
    expect(salt).toMatch(HEX_32);
  });

  it("uses a fresh salt per call so identical passwords differ", async () => {
    const first = await hashPassword("SuperSecret12345");
    const second = await hashPassword("SuperSecret12345");
    expect(first.salt).not.toBe(second.salt);
    expect(first.hash).not.toBe(second.hash);
  });
});

describe("verifyPassword", () => {
  it("accepts the correct password", async () => {
    const { hash, salt } = await hashPassword("SuperSecret12345");
    await expect(verifyPassword("SuperSecret12345", salt, hash)).resolves.toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const { hash, salt } = await hashPassword("SuperSecret12345");
    await expect(verifyPassword("WrongSecret12345", salt, hash)).resolves.toBe(false);
  });

  it("rejects a hash from a different salt instead of throwing", async () => {
    const a = await hashPassword("SuperSecret12345");
    const b = await hashPassword("SuperSecret12345");
    await expect(verifyPassword("SuperSecret12345", a.salt, b.hash)).resolves.toBe(false);
  });

  it("returns false for malformed stored values", async () => {
    await expect(verifyPassword("SuperSecret12345", "", "")).resolves.toBe(false);
    await expect(verifyPassword("SuperSecret12345", "not-hex", "not-hex")).resolves.toBe(false);
    const { hash } = await hashPassword("SuperSecret12345");
    await expect(verifyPassword("SuperSecret12345", "aa", hash)).resolves.toBe(false);
  });
});

describe("session tokens", () => {
  it("generates 256-bit hex tokens and never repeats one", () => {
    const tokens = new Set(Array.from({ length: 32 }, () => generateSessionToken()));
    expect(tokens.size).toBe(32);
    for (const token of tokens) expect(token).toMatch(HEX_64);
  });

  it("hashes a token deterministically and irreversibly enough to store", () => {
    const token = generateSessionToken();
    const digest = hashSessionToken(token);
    expect(digest).toMatch(HEX_64);
    expect(digest).not.toBe(token);
    expect(hashSessionToken(token)).toBe(digest);
    expect(hashSessionToken(generateSessionToken())).not.toBe(digest);
  });
});

describe("session cookies", () => {
  it("defaults to 30 days", () => {
    expect(sessionTtlSeconds()).toBe(30 * 24 * 60 * 60);
  });

  it("honors ADMIN_SESSION_TTL_DAYS and floors at one day", () => {
    vi.stubEnv("ADMIN_SESSION_TTL_DAYS", "7");
    expect(sessionTtlSeconds()).toBe(7 * 24 * 60 * 60);
    vi.stubEnv("ADMIN_SESSION_TTL_DAYS", "0");
    expect(sessionTtlSeconds()).toBe(24 * 60 * 60);
    vi.stubEnv("ADMIN_SESSION_TTL_DAYS", "not-a-number");
    expect(sessionTtlSeconds()).toBe(30 * 24 * 60 * 60);
  });

  it("is HttpOnly, SameSite=Lax, path-scoped, and not Secure outside production", () => {
    vi.stubEnv("NODE_ENV", "test");
    expect(sessionCookieOptions()).toEqual({
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });
  });

  it("marks the cookie Secure in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    const serialized = serializeSessionCookie("abc");
    expect(serialized).toContain("Secure");
    expect(sessionCookieOptions().secure).toBe(true);
  });

  it("omits Secure in non-production and includes the token", () => {
    vi.stubEnv("NODE_ENV", "test");
    const serialized = serializeSessionCookie("abc");
    expect(serialized).toBe(
      `${ADMIN_SESSION_COOKIE}=abc; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax`,
    );
  });

  it("expires the cookie immediately on logout", () => {
    expect(clearSessionCookie()).toBe(`${ADMIN_SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  });
});

describe("readSessionTokenFromRequest", () => {
  it("returns null when the cookie header is absent", () => {
    expect(readSessionTokenFromRequest(requestWith("GET", {}))).toBeNull();
  });

  it("finds the session cookie among other cookies", () => {
    const request = requestWith("GET", { cookie: "theme=dark; admin_session=tok-123; locale=en" });
    expect(readSessionTokenFromRequest(request)).toBe("tok-123");
  });

  it("preserves base64 padding in the token value", () => {
    const request = requestWith("GET", { cookie: "admin_session=YWJjZA===" });
    expect(readSessionTokenFromRequest(request)).toBe("YWJjZA===");
  });

  it("returns null for an empty or valueless session cookie", () => {
    expect(readSessionTokenFromRequest(requestWith("GET", { cookie: "admin_session=" }))).toBeNull();
    expect(readSessionTokenFromRequest(requestWith("GET", { cookie: "admin_session" }))).toBeNull();
  });
});

describe("assertSameOrigin", () => {
  it("allows safe methods without an Origin header", () => {
    for (const method of ["GET", "HEAD", "OPTIONS"]) {
      expect(() => assertSameOrigin(requestWith(method, {}))).not.toThrow();
    }
  });

  it("allows mutations whose Origin host matches Host", () => {
    expect(() =>
      assertSameOrigin(
        requestWith("POST", { origin: "http://localhost:3001", host: "localhost:3001" }),
      ),
    ).not.toThrow();
  });

  it("blocks a cross-origin mutation", () => {
    expectApiError(
      () => assertSameOrigin(requestWith("POST", { origin: "https://evil.test", host: "localhost:3001" })),
      403,
      "FORBIDDEN",
    );
  });

  it("blocks a mutation with no Origin or no Host", () => {
    expectApiError(() => assertSameOrigin(requestWith("POST", { host: "localhost:3001" })), 403, "FORBIDDEN");
    expectApiError(() => assertSameOrigin(requestWith("POST", { origin: "http://localhost:3001" })), 403, "FORBIDDEN");
  });

  it("blocks an unparseable Origin", () => {
    expectApiError(
      () => assertSameOrigin(requestWith("POST", { origin: "not a url", host: "localhost:3001" })),
      403,
      "FORBIDDEN",
    );
  });

  it("blocks a port mismatch even on the same hostname", () => {
    expectApiError(
      () => assertSameOrigin(requestWith("POST", { origin: "http://localhost:3002", host: "localhost:3001" })),
      403,
      "FORBIDDEN",
    );
  });
});

describe("url validation", () => {
  const parseUrl = (url: string): string => navLinkSchema.parse({ url, label: "Work", sortOrder: 0, isVisible: true }).url;

  it("accepts an absolute https URL, a root-relative path, and a fragment", () => {
    expect(parseUrl("https://github.com/anyone")).toBe("https://github.com/anyone");
    expect(parseUrl("/projects")).toBe("/projects");
    expect(parseUrl("#about")).toBe("#about");
    expect(parseUrl("#")).toBe("#");
  });

  it("rejects plain http so links cannot be downgraded", () => {
    expect(() => parseUrl("http://example.com")).toThrow(/https:\/\/ URL/);
  });

  it("rejects protocol-relative, javascript, and empty values", () => {
    for (const value of ["//evil.test", "javascript:alert(1)", "data:text/html,x", "", "   "]) {
      expect(() => parseUrl(value)).toThrow();
    }
  });

  it("rejects a fragment with unsafe characters", () => {
    expect(() => parseUrl("#<script>")).toThrow();
    expect(() => parseUrl("#with space")).toThrow();
  });
});

describe("utcDate validation", () => {
  it("parses YYYY-MM-DD as UTC midnight so no local offset can shift it", () => {
    const article = articleSchema.parse({
      title: "Hello",
      description: "World",
      url: "https://example.com/hello",
      publishedAt: "2024-01-15",
      readTimeMinutes: 3,
      category: "engineering",
      sortOrder: 0,
      isPublished: true,
    });
    expect(article.publishedAt.toISOString()).toBe("2024-01-15T00:00:00.000Z");
  });

  it("rejects other date shapes and impossible dates", () => {
    const base = {
      title: "Hello",
      description: "World",
      url: "https://example.com/hello",
      publishedAt: "nonsense",
      readTimeMinutes: 3,
      category: "engineering",
      sortOrder: 0,
      isPublished: true,
    };
    expect(() => articleSchema.parse(base)).toThrow(/YYYY-MM-DD/);
    expect(() => articleSchema.parse({ ...base, publishedAt: "01/15/2024" })).toThrow(/YYYY-MM-DD/);
    expect(() => articleSchema.parse({ ...base, publishedAt: "2024-02-30" })).toThrow(/YYYY-MM-DD/);
  });
});

describe("slug validation", () => {
  const project = {
    title: "Title",
    description: "Description",
    liveUrl: "/live",
    githubUrl: "https://github.com/anyone/repo",
    metricValue: "40%",
    metricLabel: "faster",
    sortOrder: 0,
    isPublished: true,
    categoryId: 1,
    technologies: [],
  };

  it("accepts kebab-case", () => {
    expect(projectSchema.parse({ ...project, slug: "my-project-2" }).slug).toBe("my-project-2");
  });

  it("rejects uppercase, leading dashes, and double dashes", () => {
    for (const slug of ["My-Project", "-leading", "trailing-", "double--dash", "with space", "under_score"]) {
      expect(() => projectSchema.parse({ ...project, slug })).toThrow(/kebab-case/);
    }
  });

  it("requires a positive categoryId and rejects a non-array technologies field", () => {
    expect(() => projectSchema.parse({ ...project, slug: "ok", categoryId: 0 })).toThrow();
    expect(() => projectSchema.parse({ ...project, slug: "ok", technologies: "react" })).toThrow();
  });
});

describe("skill level bounds", () => {
  const skill = { name: "TypeScript", sortOrder: 0, categoryId: 1 };

  it("accepts the inclusive 0..100 range", () => {
    expect(skillSchema.parse({ ...skill, level: 0 }).level).toBe(0);
    expect(skillSchema.parse({ ...skill, level: 100 }).level).toBe(100);
  });

  it("rejects out-of-range, negative, and fractional levels", () => {
    for (const level of [-1, 101, 55.5]) {
      expect(() => skillSchema.parse({ ...skill, level })).toThrow();
    }
  });
});

describe("hex schema guards", () => {
  it("accepts only the exact expected lengths", () => {
    expect(sessionTokenHexSchema.parse("a".repeat(64))).toBe("a".repeat(64));
    expect(passwordHashSchema.parse("b".repeat(128))).toBe("b".repeat(128));
    expect(passwordSaltSchema.parse("c".repeat(32))).toBe("c".repeat(32));
  });

  it("rejects wrong lengths and non-hex characters", () => {
    expect(() => sessionTokenHexSchema.parse("a".repeat(63))).toThrow(/Invalid hex/);
    expect(() => sessionTokenHexSchema.parse("A".repeat(64))).toThrow(/Invalid hex/);
    expect(() => passwordHashSchema.parse("b".repeat(127))).toThrow(/Invalid hex/);
    expect(() => passwordSaltSchema.parse("z".repeat(32))).toThrow(/Invalid hex/);
  });
});

describe("loginSchema", () => {
  it("rejects empty or whitespace-only credentials", () => {
    expect(() => loginSchema.parse({ username: "", password: "x" })).toThrow(/Username/);
    expect(() => loginSchema.parse({ username: "   ", password: "x" })).toThrow(/Username/);
    expect(() => loginSchema.parse({ username: "admin", password: "" })).toThrow(/Password/);
  });

  it("trims surrounding whitespace from the username", () => {
    expect(loginSchema.parse({ username: "  admin  ", password: "x" }).username).toBe("admin");
  });
});
