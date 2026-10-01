import { toResponse } from "@/lib/api";
import { getExperiences } from "@/lib/repositories";

/** GET /api/v1/experiences — published experience entries, sorted. */
export async function GET(): Promise<Response> {
  return toResponse(() => getExperiences());
}
