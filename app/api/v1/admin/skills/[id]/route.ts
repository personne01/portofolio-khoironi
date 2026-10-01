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
import { skillSchema } from "@/lib/admin/schemas";
import {
  getAdminSkill,
  softDeleteSkill,
  updateSkill,
} from "@/lib/admin/admin-repositories";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "GET");
    const id = await readIdParam(context);
    return requireEntity(await getAdminSkill(id, db), "Skill not found");
  });
}

export async function PUT(request: Request, context: RouteContext): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "PUT");
    const id = await readIdParam(context);
    const input = parseInput(skillSchema, await readJsonBody(request));
    return runAdminWrite(() => updateSkill(id, input, db), "Skill not found");
  });
}

export async function DELETE(request: Request, context: RouteContext): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "DELETE");
    const id = await readIdParam(context);
    return runAdminWrite(() => softDeleteSkill(id, db), "Skill not found");
  });
}
