import "server-only";

import { ApiError } from "@/lib/errors";

/**
 * CSRF defense for admin mutations.
 *
 * Strategy: SameSite=Lax cookies block cross-site POSTs from most browsers,
 * and this Origin check hardens the remaining cases. Every state-changing
 * request (anything but GET/HEAD/OPTIONS) must carry an Origin header whose
 * host matches the request's Host header. An attacker's form/fetch from
 * another origin cannot supply a matching Origin, and scripts on the same
 * origin cannot read confidential state across it anyway.
 */

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function assertSameOrigin(request: Request): void {
  if (SAFE_METHODS.has(request.method)) return;

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (origin === null || host === null) {
    throw new ApiError(403, "FORBIDDEN", "Missing Origin header");
  }

  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    throw new ApiError(403, "FORBIDDEN", "Invalid Origin header");
  }

  if (originUrl.host !== host) {
    throw new ApiError(403, "FORBIDDEN", "Cross-origin request blocked");
  }
}