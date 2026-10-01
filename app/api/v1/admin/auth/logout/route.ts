import { fail, ok } from "@/lib/api";
import { assertSameOrigin } from "@/lib/admin/csrf";
import {
  clearSessionCookie,
  deleteAdminSession,
  readSessionTokenFromRequest,
} from "@/lib/admin/session";
import { ApiError } from "@/lib/errors";

/**
 * POST /api/v1/admin/auth/logout — revokes the session row and clears the
 * cookie. Idempotent: logging out without a valid session still succeeds, and
 * the cookie is cleared on both the success and the error path so a client
 * never keeps a stale cookie after a failed logout.
 */
export async function POST(request: Request): Promise<Response> {
  let response: Response;
  try {
    assertSameOrigin(request);
    const token = readSessionTokenFromRequest(request);
    if (token !== null) {
      await deleteAdminSession(token);
    }
    response = Response.json(ok({ loggedOut: true }));
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    if (status === 500) console.error("[api] unexpected error:", error);
    response = Response.json(fail(error), { status });
  }
  response.headers.append("Set-Cookie", clearSessionCookie());
  return response;
}
