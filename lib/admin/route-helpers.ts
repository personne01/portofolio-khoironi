import "server-only";

import { z } from "zod";

import { fail, ok } from "@/lib/api";
import { requireAdminSession } from "@/lib/admin/auth";
import { assertSameOrigin } from "@/lib/admin/csrf";
import { ApiError, badRequestError, notFoundError } from "@/lib/errors";

/**
 * Shared plumbing for the /api/v1/admin routes: body parsing, zod validation
 * with readable messages, and mapping Prisma's unique-constraint violation to
 * 409 instead of an opaque 500.
 */

export async function readJsonBody(request: Request): Promise<unknown> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw badRequestError("Request body must be valid JSON");
  }
  return raw;
}

export function parseInput<TSchema extends z.ZodType>(
  schema: TSchema,
  payload: unknown,
): z.output<TSchema> {
  const result = schema.safeParse(payload);
  if (result.success) return result.data;
  const issue = result.error.issues[0];
  const field = issue?.path.join(".") ?? "";
  const message = issue?.message ?? "Invalid input";
  throw badRequestError(field === "" ? message : `${field}: ${message}`);
}

const PRISMA_UNIQUE_VIOLATION = "P2002";

/**
 * Wraps a Prisma call so a duplicate slug/name surfaces as 409 CONFLICT with
 * the offending field, and a missing row surfaces as 404.
 */
export async function runAdminWrite<T>(
  operation: () => Promise<T>,
  notFoundMessage?: string,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ApiError(409, "CONFLICT", uniqueFieldMessage(error));
    }
    if (isMissingRow(error) && notFoundMessage !== undefined) {
      throw notFoundError(notFoundMessage);
    }
    throw error;
  }
}

type PrismaKnownError = { code?: string; meta?: { target?: string[] | string } };

function isPrismaKnownError(error: unknown): error is PrismaKnownError {
  return typeof error === "object" && error !== null && "code" in error;
}

function isUniqueViolation(error: unknown): boolean {
  return isPrismaKnownError(error) && error.code === PRISMA_UNIQUE_VIOLATION;
}

const TARGET_LABELS: Record<string, string> = {
  slug: "Slug is already in use",
  username: "Username is already in use",
  categoryId_name: "That name already exists in this category",
  projectId_name: "That technology is already listed",
  experienceId_name: "That technology is already listed",
};

function uniqueFieldMessage(error: unknown): string {
  const target = isPrismaKnownError(error) ? error.meta?.target : undefined;
  const fields = typeof target === "string" ? [target] : (target ?? []);
  for (const field of fields) {
    const label = TARGET_LABELS[field];
    if (label !== undefined) return label;
  }
  return "A record with that value already exists";
}

function isMissingRow(error: unknown): boolean {
  if (!isPrismaKnownError(error)) return false;
  return error.code === "P2025";
}

export function requireEntity<T>(entity: T | null, message: string): T {
  if (entity === null) throw notFoundError(message);
  return entity;
}

export async function readIdParam(context: { params: Promise<{ id: string }> }): Promise<number> {
  const { id } = await context.params;
  const parsed = z.coerce.number().int().positive().safeParse(id);
  if (!parsed.success) throw badRequestError("Invalid resource id");
  return parsed.data;
}

export function readIncludeDeleted(request: Request): boolean {
  const value = new URL(request.url).searchParams.get("includeDeleted");
  return value === "true" || value === "1";
}

type GuardedRequest = Request;

/**
 * Runs an admin route body behind both guards: a valid session (401) and, for
 * unsafe methods, a same-origin check (403). Session check runs first so an
 * anonymous caller never learns whether its Origin was acceptable.
 */
export async function guardAdminRoute(
  request: GuardedRequest,
  method: string,
): Promise<void> {
  await requireAdminSession(request);
  if (!SAFE_METHODS.has(method.toUpperCase())) {
    assertSameOrigin(request);
  }
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export async function adminRoute<T>(run: () => Promise<T> | T): Promise<Response> {
  try {
    return Response.json(ok(await run()));
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(fail(error), { status: error.status });
    }
    console.error("[api] unexpected error:", error);
    return Response.json(fail(error), { status: 500 });
  }
}
