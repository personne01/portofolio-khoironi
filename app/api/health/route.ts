import { toResponse } from "@/lib/api";

/** GET /api/health — pure liveness probe, no database touch. */
export async function GET(): Promise<Response> {
  return toResponse(() => ({
    status: "ok",
    service: "portfolio-api",
    timestamp: new Date().toISOString(),
  }));
}
