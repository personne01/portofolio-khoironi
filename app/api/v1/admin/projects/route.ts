import { db } from "@/lib/db";
import {
  adminRoute,
  guardAdminRoute,
  parseInput,
  readIncludeDeleted,
  readJsonBody,
  runAdminWrite,
} from "@/lib/admin/route-helpers";
import { projectSchema } from "@/lib/admin/schemas";
import { createProject, listAdminProjects } from "@/lib/admin/admin-repositories";

export async function GET(request: Request): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "GET");
    return listAdminProjects(db, readIncludeDeleted(request));
  });
}

export async function POST(request: Request): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "POST");
    const input = parseInput(projectSchema, await readJsonBody(request));
    return runAdminWrite(() => createProject(input, db));
  });
}
