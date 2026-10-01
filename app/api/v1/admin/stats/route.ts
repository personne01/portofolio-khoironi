import { db } from "@/lib/db";
import { adminRoute, guardAdminRoute } from "@/lib/admin/route-helpers";
import { getAdminStats } from "@/lib/admin/admin-repositories";

export async function GET(request: Request): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "GET");
    return getAdminStats(db);
  });
}
