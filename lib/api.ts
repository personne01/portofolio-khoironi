import { ApiError } from "@/lib/errors";

export type ApiResult<T> = { data: T };

export type ApiFailure = { error: { code: string; message: string } };

export function ok<T>(data: T): ApiResult<T> {
  return { data };
}

/** Maps an `ApiError` to its public envelope; unexpected errors never leak internals. */
export function fail(error: unknown): ApiFailure {
  if (error instanceof ApiError) {
    return { error: { code: error.code, message: error.message } };
  }
  return { error: { code: "INTERNAL", message: "Internal server error" } };
}

/**
 * Wraps a route handler so every endpoint shares the same envelope and error
 * mapping: success `{data}`, `ApiError` → its status/code/message, anything
 * else → 500 with no internals exposed.
 */
export async function toResponse<T>(
  run: () => Promise<T> | T,
): Promise<Response> {
  try {
    const data = await run();
    return Response.json(ok(data), { status: 200 });
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(fail(error), { status: error.status });
    }
    console.error("[api] unexpected error:", error);
    return Response.json(fail(error), { status: 500 });
  }
}
