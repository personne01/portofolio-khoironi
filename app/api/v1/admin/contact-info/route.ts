import { db } from "@/lib/db";
import {
  adminRoute,
  guardAdminRoute,
  parseInput,
  readJsonBody,
  requireEntity,
  runAdminWrite,
} from "@/lib/admin/route-helpers";
import { contactInfoSchema } from "@/lib/admin/schemas";
import { getContactInfoSingleton, updateContactInfo } from "@/lib/admin/admin-repositories";

export async function GET(request: Request): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "GET");
    return requireEntity(await getContactInfoSingleton(db), "Contact info is not seeded");
  });
}

export async function PUT(request: Request): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "PUT");
    const input = parseInput(contactInfoSchema, await readJsonBody(request));
    return runAdminWrite(() => updateContactInfo(input, db), "Contact info is not seeded");
  });
}
