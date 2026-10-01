import "server-only";

import { createHash, randomBytes } from "node:crypto";

import type { PrismaClient } from "@/lib/generated/prisma/client";
import { db } from "@/lib/db";

/**
 * Admin session tokens.
 *
 * The token handed to the browser is 32 random bytes hex — 256 bits of
 * entropy. Only its SHA-256 digest is stored in `admin_sessions`, so a
 * database leak does not expose live session tokens. `findAdminSession`
 * enforces expiry and lazily deletes the expired row.
 */

export const ADMIN_SESSION_COOKIE = "admin_session";

/** Default session lifetime: 30 days; override via ADMIN_SESSION_TTL_DAYS. */
const DEFAULT_TTL_DAYS = 30;

export function sessionTtlMs(): number {
  const days = Number(process.env["ADMIN_SESSION_TTL_DAYS"] ?? DEFAULT_TTL_DAYS);
  return Math.max(1, Number.isFinite(days) ? days : DEFAULT_TTL_DAYS) * 24 * 60 * 60 * 1000;
}

export function sessionTtlSeconds(): number {
  return Math.floor(sessionTtlMs() / 1000);
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export type AdminSessionRow = {
  id: number;
  /** Raw token to set on the cookie — never persisted. */
  token: string;
  expiresAt: Date;
};

/** Creates a session row and returns the raw token for the cookie. */
export async function createAdminSession(
  userId: number,
  client: RepositoryClient = db,
): Promise<AdminSessionRow> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + sessionTtlMs());
  const session = await client.adminSession.create({
    data: { userId, tokenHash: hashSessionToken(token), expiresAt },
  });
  return { id: session.id, token, expiresAt };
}

export type AdminSessionWithUser = {
  userId: number;
  username: string;
  expiresAt: Date;
};

/**
 * Looks up a session by its raw cookie token. Returns null when the token is
 * unknown or expired; expired rows are deleted as they are discovered.
 */
export async function findAdminSession(
  token: string,
  client: RepositoryClient = db,
): Promise<AdminSessionWithUser | null> {
  if (token === "") return null;
  const session = await client.adminSession.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: { user: { select: { id: true, username: true } } },
  });
  if (session === null) return null;
  if (session.expiresAt.getTime() <= Date.now()) {
    await client.adminSession.delete({ where: { id: session.id } });
    return null;
  }
  return { userId: session.userId, username: session.user.username, expiresAt: session.expiresAt };
}

/** Revokes a session (logout). No-op when the token is unknown. */
export async function deleteAdminSession(
  token: string,
  client: RepositoryClient = db,
): Promise<void> {
  if (token === "") return;
  await client.adminSession.deleteMany({ where: { tokenHash: hashSessionToken(token) } });
}

export type SessionCookieOptions = {
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: "/";
  maxAge: number;
};

export function sessionCookieOptions(): SessionCookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env["NODE_ENV"] === "production",
    path: "/",
    maxAge: sessionTtlSeconds(),
  };
}

/** Serializes a Set-Cookie header value for a live session. */
export function serializeSessionCookie(token: string): string {
  const options = sessionCookieOptions();
  const parts = [
    `${ADMIN_SESSION_COOKIE}=${token}`,
    `Path=${options.path}`,
    `Max-Age=${options.maxAge}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (options.secure) parts.push("Secure");
  return parts.join("; ");
}

/** Serializes a Set-Cookie header value that clears the session cookie. */
export function clearSessionCookie(): string {
  return `${ADMIN_SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}

/**
 * Reads the raw session token from a Request's Cookie header. Route handlers
 * receive the Request directly, so parsing the header keeps this function
 * unit-testable without Next's async `cookies()` store.
 */
export function readSessionTokenFromRequest(request: Request): string | null {
  const header = request.headers.get("cookie");
  if (header === null) return null;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === ADMIN_SESSION_COOKIE && rest.length > 0) {
      const value = rest.join("=");
      return value === "" ? null : value;
    }
  }
  return null;
}

export type RepositoryClient = PrismaClient;