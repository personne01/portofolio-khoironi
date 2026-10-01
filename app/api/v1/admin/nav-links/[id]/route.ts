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
import { navLinkSchema } from "@/lib/admin/schemas";
import {
  getAdminNavLink,
  softDeleteNavLink,
  updateNavLink,
} from "@/lib/admin/admin-repositories";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "GET");
    const id = await readIdParam(context);
    return requireEntity(await getAdminNavLink(id, db), "Nav link not found");
  });
}

export async function PUT(request: Request, context: RouteContext): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "PUT");
    const id = await readIdParam(context);
    const input = parseInput(navLinkSchema, await readJsonBody(request));
    return runAdminWrite(() => updateNavLink(id, input, db), "Nav link not found");
  });
}

export async function DELETE(request: Request, context: RouteContext): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "DELETE");
    const id = await readIdParam(context);
    return runAdminWrite(() => softDeleteNavLink(id, db), "Nav link not found");
  });
}
