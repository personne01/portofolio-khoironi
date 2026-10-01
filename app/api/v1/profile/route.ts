import { toResponse } from "@/lib/api";
import { getProfileData } from "@/lib/repositories";

/** GET /api/v1/profile — singleton identity plus derived hero stats. */
export async function GET(): Promise<Response> {
  return toResponse(() => getProfileData());
}
