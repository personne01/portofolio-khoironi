import { db } from "@/lib/db";
import {
  adminRoute,
  guardAdminRoute,
  parseInput,
  readJsonBody,
  requireEntity,
  runAdminWrite,
} from "@/lib/admin/route-helpers";
import { profileSchema } from "@/lib/admin/schemas";
import { getProfileSingleton, updateProfile } from "@/lib/admin/admin-repositories";

export async function GET(request: Request): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "GET");
    return requireEntity(await getProfileSingleton(db), "Profile is not seeded");
  });
}

export async function PUT(request: Request): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "PUT");
    const input = parseInput(profileSchema, await readJsonBody(request));
    return runAdminWrite(() => updateProfile(input, db), "Profile is not seeded");
  });
}
