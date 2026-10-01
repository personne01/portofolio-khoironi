import { NextRequest, NextResponse } from "next/server";

/**
 * CORS for the public REST API.
 *
 * Only origins listed in CORS_ALLOWED_ORIGINS receive the header; a browser
 * request from any other origin simply runs without CORS headers (same-origin
 * requests are unaffected). OPTIONS preflights short-circuit with 204.
 *
 * Deliberately self-contained: no imports from lib/*, because Next may run
 * proxy on the edge runtime where server-only modules are unavailable.
 */
const DEFAULT_ALLOWED_ORIGINS = "http://localhost:3000,http://127.0.0.1:3000";

function allowedOrigins(): string[] {
  const raw = process.env.CORS_ALLOWED_ORIGINS ?? DEFAULT_ALLOWED_ORIGINS;
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin !== "");
}

export function proxy(request: NextRequest): NextResponse {
  const origin = request.headers.get("origin");
  const allowed =
    origin !== null && allowedOrigins().includes(origin) ? origin : null;

  if (request.method === "OPTIONS") {
    const preflight = new NextResponse(null, { status: 204 });
    if (allowed !== null) {
      preflight.headers.set("Access-Control-Allow-Origin", allowed);
      preflight.headers.set("Vary", "Origin");
      preflight.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
      preflight.headers.set("Access-Control-Allow-Headers", "Content-Type");
      preflight.headers.set("Access-Control-Max-Age", "86400");
    }
    return preflight;
  }

  const response = NextResponse.next();
  if (allowed !== null) {
    response.headers.set("Access-Control-Allow-Origin", allowed);
    response.headers.set("Vary", "Origin");
  }
  return response;
}

export const config = {
  matcher: "/api/:path*",
};