import { fail, ok } from "@/lib/api";
import { assertSameOrigin } from "@/lib/admin/csrf";
import { readJsonBody, parseInput } from "@/lib/admin/route-helpers";
import { verifyPassword } from "@/lib/admin/password";
import { createAdminSession, serializeSessionCookie } from "@/lib/admin/session";
import { loginSchema } from "@/lib/admin/schemas";
import { findAdminUserByUsername } from "@/lib/admin/admin-repositories";
import { ApiError } from "@/lib/errors";

const INVALID_CREDENTIALS = new ApiError(401, "INVALID_CREDENTIALS", "Invalid username or password");

/** Salt/hash of an account that cannot exist, used to equalize timing on a miss. */
const ABSENT_SALT = "0".repeat(32);
const ABSENT_HASH = "0".repeat(128);

/**
 * POST /api/v1/admin/auth/login — verifies credentials, creates a server-side
 * session, and sets the HttpOnly session cookie.
 *
 * Unknown usernames and wrong passwords return the identical message and both
 * run a verification, so neither the response body nor its timing reveals which
 * usernames exist.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const { username, password } = parseInput(loginSchema, await readJsonBody(request));

    const user = await findAdminUserByUsername(username);
    const matches = await verifyPassword(
      password,
      user?.passwordSalt ?? ABSENT_SALT,
      user?.passwordHash ?? ABSENT_HASH,
    );
    if (user === null || !matches) throw INVALID_CREDENTIALS;

    const session = await createAdminSession(user.id);
    const response = Response.json(
      ok({ username: user.username, session: { id: session.id, expiresAt: session.expiresAt } }),
    );
    response.headers.append("Set-Cookie", serializeSessionCookie(session.token));
    return response;
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    if (status === 500) console.error("[api] unexpected error:", error);
    return Response.json(fail(error), { status });
  }
}
