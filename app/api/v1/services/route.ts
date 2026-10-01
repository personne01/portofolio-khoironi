import { toResponse } from "@/lib/api";
import { getServices } from "@/lib/repositories";

/** GET /api/v1/services — all services with features, sorted. */
export async function GET(): Promise<Response> {
  return toResponse(() => getServices());
}
