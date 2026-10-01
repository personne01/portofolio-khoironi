import { db } from "@/lib/db";
import {
  adminRoute,
  guardAdminRoute,
  parseInput,
  readIncludeDeleted,
  readJsonBody,
  runAdminWrite,
} from "@/lib/admin/route-helpers";
import { experienceSchema } from "@/lib/admin/schemas";
import { createExperience, listAdminExperiences } from "@/lib/admin/admin-repositories";

export async function GET(request: Request): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "GET");
    return listAdminExperiences(db, readIncludeDeleted(request));
  });
}

export async function POST(request: Request): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "POST");
    const input = parseInput(experienceSchema, await readJsonBody(request));
    return runAdminWrite(() => createExperience(input, db));
  });
}
