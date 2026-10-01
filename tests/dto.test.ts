import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  experienceYearsLabel,
  formatArticleDate,
  formatExperiencePeriod,
  formatMonthYear,
  formatReadTime,
} from "@/lib/dto";

describe("formatMonthYear", () => {
  it("renders the UTC month and year", () => {
    expect(formatMonthYear(new Date(Date.UTC(2023, 2, 1)))).toBe("Mar 2023");
  });
});

describe("formatArticleDate", () => {
  it("renders the UTC full date", () => {
    expect(formatArticleDate(new Date(Date.UTC(2025, 9, 5)))).toBe(
      "Oct 5, 2025",
    );
  });
});

describe("formatReadTime", () => {
  it("renders minutes", () => {
    expect(formatReadTime(2)).toBe("2 min read");
  });
});

describe("formatExperiencePeriod", () => {
  it("renders an ended period", () => {
    expect(
      formatExperiencePeriod(
        new Date(Date.UTC(2020, 0, 1)),
        new Date(Date.UTC(2020, 7, 1)),
      ),
    ).toBe("Jan 2020 - Aug 2020");
  });

  it("renders Present for an open-ended period", () => {
    expect(formatExperiencePeriod(new Date(Date.UTC(2023, 2, 1)), null)).toBe(
      "Mar 2023 - Present",
    );
  });
});

describe("experienceYearsLabel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("replicates the constant derivation (career start 2022-10-01 → 3+)", () => {
    vi.setSystemTime(new Date("2026-09-30T10:00:00Z"));
    expect(experienceYearsLabel(new Date(Date.UTC(2022, 9, 1)))).toBe("3+");
  });

  it("does not add a year before the career-start month", () => {
    vi.setSystemTime(new Date("2026-09-30T10:00:00Z"));
    expect(experienceYearsLabel(new Date(Date.UTC(2022, 9, 1)))).toBe("3+");
  });

  it("adds a year once the career-start month is reached", () => {
    vi.setSystemTime(new Date("2026-10-01T00:00:00Z"));
    expect(experienceYearsLabel(new Date(Date.UTC(2022, 9, 1)))).toBe("4+");
  });
});
