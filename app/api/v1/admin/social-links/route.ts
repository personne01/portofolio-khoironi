import { db } from "@/lib/db";
import {
  adminRoute,
  guardAdminRoute,
  parseInput,
  readIncludeDeleted,
  readJsonBody,
  runAdminWrite,
} from "@/lib/admin/route-helpers";
import { socialLinkSchema } from "@/lib/admin/schemas";
import { createSocialLink, listAdminSocialLinks } from "@/lib/admin/admin-repositories";

export async function GET(request: Request): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "GET");
    return listAdminSocialLinks(db, readIncludeDeleted(request));
  });
}

export async function POST(request: Request): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "POST");
    const input = parseInput(socialLinkSchema, await readJsonBody(request));
    return runAdminWrite(() => createSocialLink(input, db));
  });
}
