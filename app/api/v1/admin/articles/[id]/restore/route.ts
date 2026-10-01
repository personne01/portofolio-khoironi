import { db } from "@/lib/db";
import { adminRoute, guardAdminRoute, readIdParam, runAdminWrite } from "@/lib/admin/route-helpers";
import { restoreArticle } from "@/lib/admin/admin-repositories";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "POST");
    const id = await readIdParam(context);
    return runAdminWrite(() => restoreArticle(id, db), "Article not found");
  });
}
