import { toResponse } from "@/lib/api";
import { getSocialLinks } from "@/lib/repositories";

/** GET /api/v1/social-links — visible social profiles, sorted. */
export async function GET(): Promise<Response> {
  return toResponse(() => getSocialLinks());
}
