import { toResponse } from "@/lib/api";
import { getNavLinks } from "@/lib/repositories";

/** GET /api/v1/nav-links — visible navigation anchors, sorted. */
export async function GET(): Promise<Response> {
  return toResponse(() => getNavLinks());
}
