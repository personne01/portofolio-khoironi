import { db } from "@/lib/db";
import {
  adminRoute,
  guardAdminRoute,
  parseInput,
  readIncludeDeleted,
  readJsonBody,
  runAdminWrite,
} from "@/lib/admin/route-helpers";
import { skillSchema } from "@/lib/admin/schemas";
import { createSkill, listAdminSkills } from "@/lib/admin/admin-repositories";

export async function GET(request: Request): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "GET");
    return listAdminSkills(db, readIncludeDeleted(request));
  });
}

export async function POST(request: Request): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "POST");
    const input = parseInput(skillSchema, await readJsonBody(request));
    return runAdminWrite(() => createSkill(input, db));
  });
}
