import { toResponse } from "@/lib/api";
import { getProjects } from "@/lib/repositories";

/** GET /api/v1/projects — published projects, sorted. */
export async function GET(): Promise<Response> {
  return toResponse(() => getProjects());
}
