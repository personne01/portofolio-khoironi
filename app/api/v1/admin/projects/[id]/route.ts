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
import { projectSchema } from "@/lib/admin/schemas";
import {
  getAdminProject,
  softDeleteProject,
  updateProject,
} from "@/lib/admin/admin-repositories";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "GET");
    const id = await readIdParam(context);
    return requireEntity(await getAdminProject(id, db), "Project not found");
  });
}

export async function PUT(request: Request, context: RouteContext): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "PUT");
    const id = await readIdParam(context);
    const input = parseInput(projectSchema, await readJsonBody(request));
    return runAdminWrite(() => updateProject(id, input, db), "Project not found");
  });
}

export async function DELETE(request: Request, context: RouteContext): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "DELETE");
    const id = await readIdParam(context);
    return runAdminWrite(() => softDeleteProject(id, db), "Project not found");
  });
}
