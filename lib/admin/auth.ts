import "server-only";

import { cookies } from "next/headers";

import { ApiError } from "@/lib/errors";
import {
  ADMIN_SESSION_COOKIE,
  findAdminSession,
  readSessionTokenFromRequest,
  type RepositoryClient,
} from "@/lib/admin/session";

/**
 * Auth helpers shared by the admin API routes and the admin pages.
 */

export type AdminIdentity = {
  userId: number;
  username: string;
};

/**
 * Guards an API route: returns the identity when a valid session cookie is
 * present, otherwise throws 401. Anything at or above this boundary must
 * never trust the cookie value without the DB lookup (a cookie alone is not
 * authentication).
 */
export async function requireAdminSession(request: Request): Promise<AdminIdentity> {
  const token = readSessionTokenFromRequest(request);
  if (token === null || token === "") {
    throw new ApiError(401, "UNAUTHORIZED", "Authentication required");
  }
  const session = await findAdminSession(token);
  if (session === null) {
    throw new ApiError(401, "UNAUTHORIZED", "Authentication required");
  }
  return { userId: session.userId, username: session.username };
}

/**
 * Guards server-rendered admin pages (no Request object available, so it
 * reads the cookie store). Returns null for anonymous visitors instead of
 * throwing — pages decide whether to redirect to /admin/login.
 */
export async function getCurrentAdmin(): Promise<AdminIdentity | null> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (token === undefined || token === "") return null;
  const session = await findAdminSession(token);
  if (session === null) return null;
  return { userId: session.userId, username: session.username };
}

/** Export type for callers that inject a test client. */
export type AuthClient = RepositoryClient;