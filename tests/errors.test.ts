import { describe, expect, it } from "vitest";
import {
  ApiError,
  badRequestError,
  internalError,
  notFoundError,
} from "@/lib/errors";

describe("ApiError", () => {
  it("carries status, code and message", () => {
    const err = new ApiError(404, "NOT_FOUND", "gone");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("ApiError");
    expect(err.status).toBe(404);
    expect(err.code).toBe("NOT_FOUND");
    expect(err.message).toBe("gone");
  });
});

describe("error factories", () => {
  it("notFoundError defaults to 404 and maps its message", () => {
    expect(notFoundError().status).toBe(404);
    expect(notFoundError().code).toBe("NOT_FOUND");
    expect(notFoundError("gone").message).toBe("gone");
  });

  it("badRequestError is a 400 with the given message", () => {
    expect(badRequestError("bad input").status).toBe(400);
    expect(badRequestError("bad input").code).toBe("BAD_REQUEST");
    expect(badRequestError("bad input").message).toBe("bad input");
  });

  it("internalError defaults to 500", () => {
    expect(internalError().status).toBe(500);
    expect(internalError().code).toBe("INTERNAL");
  });
});
