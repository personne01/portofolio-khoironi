import { toResponse } from "@/lib/api";
import { requireAdminSession } from "@/lib/admin/auth";

/** GET /api/v1/admin/auth/me — identity of the current admin, or 401. */
export async function GET(request: Request): Promise<Response> {
  return toResponse(async () => {
    const admin = await requireAdminSession(request);
    return { username: admin.username };
  });
}
