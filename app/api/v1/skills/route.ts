import { toResponse } from "@/lib/api";
import { getSkills } from "@/lib/repositories";

/** GET /api/v1/skills — all skills, ordered by category then within category. */
export async function GET(): Promise<Response> {
  return toResponse(() => getSkills());
}
