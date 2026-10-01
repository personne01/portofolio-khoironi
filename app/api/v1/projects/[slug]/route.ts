import { toResponse } from "@/lib/api";
import { getProjectBySlug } from "@/lib/repositories";

type RouteContext = { params: Promise<{ slug: string }> };

/** GET /api/v1/projects/[slug] — a single published project. */
export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  const { slug } = await context.params;
  return toResponse(() => getProjectBySlug(slug));
}
