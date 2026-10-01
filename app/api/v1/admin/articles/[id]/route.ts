import { db } from "@/lib/db";
import {
  adminRoute,
  guardAdminRoute,
  parseInput,
  readIdParam,
  readJsonBody,
  requireEntity,
  runAdminWrite,
} from "@/lib/admin/route-helpers";
import { articleSchema } from "@/lib/admin/schemas";
import {
  getAdminArticle,
  softDeleteArticle,
  updateArticle,
} from "@/lib/admin/admin-repositories";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "GET");
    const id = await readIdParam(context);
    return requireEntity(await getAdminArticle(id, db), "Article not found");
  });
}

export async function PUT(request: Request, context: RouteContext): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "PUT");
    const id = await readIdParam(context);
    const input = parseInput(articleSchema, await readJsonBody(request));
    return runAdminWrite(() => updateArticle(id, input, db), "Article not found");
  });
}

export async function DELETE(request: Request, context: RouteContext): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "DELETE");
    const id = await readIdParam(context);
    return runAdminWrite(() => softDeleteArticle(id, db), "Article not found");
  });
}
