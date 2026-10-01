import { db } from "@/lib/db";
import { adminRoute, guardAdminRoute } from "@/lib/admin/route-helpers";
import { listProjectCategories, listSkillCategories } from "@/lib/admin/admin-repositories";

export async function GET(request: Request): Promise<Response> {
  return adminRoute(async () => {
    await guardAdminRoute(request, "GET");
    const [skills, projects] = await Promise.all([listSkillCategories(db), listProjectCategories(db)]);
    return { skills, projects };
  });
}
