import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchHomeData, fetchProfile } from "@/lib/api-client";

// Mirrors the module-level default in lib/api-client.ts so the assertions work
// regardless of whether API_BASE_URL is set in the test environment.
const API_BASE_URL =
  process.env.API_BASE_URL?.replace(/\/+$/, "") ?? "http://127.0.0.1:3000";

type FetchMock = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("api-client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("unwraps the data envelope and requests a 60s revalidation window", async () => {
    const mockFetch = vi
      .fn<FetchMock>()
      .mockResolvedValue(jsonResponse({ data: { id: 1, name: "Khoironi" } }));
    vi.stubGlobal("fetch", mockFetch);

    await expect(fetchProfile()).resolves.toEqual({ id: 1, name: "Khoironi" });

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/v1/profile`,
      expect.objectContaining({
        next: { revalidate: 60 },
        headers: { Accept: "application/json" },
      }),
    );
  });

  it("isolates a failing endpoint as undefined without failing the home batch", async () => {
    const mockFetch = vi.fn<FetchMock>((input) => {
      if (String(input).endsWith("/projects")) {
        return Promise.resolve(
          jsonResponse({ error: { code: "UPSTREAM_DOWN" } }, 503),
        );
      }
      if (String(input).endsWith("/profile")) {
        return Promise.resolve(jsonResponse({ data: { id: 1 } }));
      }
      return Promise.resolve(jsonResponse({ data: [] }));
    });
    vi.stubGlobal("fetch", mockFetch);

    const data = await fetchHomeData();

    expect(mockFetch).toHaveBeenCalledTimes(9);
    expect(data).toEqual({
      profile: { id: 1 },
      navLinks: [],
      socialLinks: [],
      skills: [],
      projects: undefined,
      services: [],
      experiences: [],
      articles: [],
      contactInfo: [],
    });
  });

  it("sends every home fetch with the 60s revalidation window", async () => {
    const mockFetch = vi
      .fn<FetchMock>()
      .mockResolvedValue(jsonResponse({ data: [] }));
    vi.stubGlobal("fetch", mockFetch);

    await fetchHomeData();

    expect(mockFetch).toHaveBeenCalledTimes(9);
    for (const call of mockFetch.mock.calls) {
      expect(call[1]).toMatchObject({ next: { revalidate: 60 } });
    }
  });
});