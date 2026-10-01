/**
 * Shared error type for the API layer. Pure module: no `server-only` import,
 * so the api-client (server) and route handlers can both throw it.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function notFoundError(message = "Resource not found"): ApiError {
  return new ApiError(404, "NOT_FOUND", message);
}

export function badRequestError(message: string): ApiError {
  return new ApiError(400, "BAD_REQUEST", message);
}

export function internalError(message = "Internal server error"): ApiError {
  return new ApiError(500, "INTERNAL", message);
}
