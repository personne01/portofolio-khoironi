import { afterEach, describe, expect, it, vi } from "vitest";
import { fail, ok, toResponse } from "@/lib/api";
import { notFoundError } from "@/lib/errors";

describe("ok", () => {
  it("wraps data in the success envelope", () => {
    expect(ok({ items: [] })).toEqual({ data: { items: [] } });
  });
});

describe("fail", () => {
  it("maps an ApiError to its public envelope", () => {
    expect(fail(notFoundError("gone"))).toEqual({
      error: { code: "NOT_FOUND", message: "gone" },
    });
  });

  it("never leaks internals for unknown errors", () => {
    expect(fail(new Error("secret db password"))).toEqual({
      error: { code: "INTERNAL", message: "Internal server error" },
    });
  });
});

describe("toResponse", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 200 with the data envelope on success", async () => {
    const res = await toResponse(() => ({ items: [1] }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ data: { items: [1] } });
  });

  it("maps an ApiError to its status code", async () => {
    const res = await toResponse(() => {
      throw notFoundError("gone");
    });
    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({
      error: { code: "NOT_FOUND", message: "gone" },
    });
  });

  it("maps unknown errors to 500 without leaking internals", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await toResponse(() => {
      throw new Error("boom");
    });
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      error: { code: "INTERNAL", message: "Internal server error" },
    });
    expect(errorSpy).toHaveBeenCalledOnce();
  });
});
