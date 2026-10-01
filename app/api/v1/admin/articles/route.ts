import { db } from "@/lib/db";
import {
  adminRoute,
  guardAdminRoute,
  parseInput,
  readIncludeDeleted,
  readJsonBody,
  runAdminWrite,
} from "@/lib/admin/route-helpers";
import { articleSchema } from "@/lib/admin/schemas";
import { createArticle, listAdminArticles } from "@/lib/admin/admin-repositories";

export async function GET(request: Request): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "GET");
    return listAdminArticles(db, readIncludeDeleted(request));
  });
}

export async function POST(request: Request): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "POST");
    const input = parseInput(articleSchema, await readJsonBody(request));
    return runAdminWrite(() => createArticle(input, db));
  });
}
