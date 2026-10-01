import { toResponse } from "@/lib/api";
import { getArticles } from "@/lib/repositories";

/** GET /api/v1/articles — published articles, newest first. */
export async function GET(): Promise<Response> {
  return toResponse(() => getArticles());
}
