/**
 * Pure DTO layer for the portfolio API.
 *
 * Deliberately free of any `server-only` import so it can be unit-tested and
 * type-imported from client components. The shapes mirror
 * `constant/portfolio.ts` exactly, so a client component can accept either a
 * fetched DTO or the static constant as a fallback prop.
 *
 * Every Date is rendered in UTC. The DB stores `@db.Date` values at UTC
 * midnight, so server-rendered strings never drift from what the original
 * constant file displayed, regardless of the server's time zone.
 */

export type PersonalInfoDto = {
  name: string;
  fullName: string;
  title: string;
  subtitle: string;
  email: string;
  location: string;
  /** Constant key `avatar`; sourced from `profiles.photo_url`. */
  avatar: string;
  /** Constant key `resume`; sourced from `profiles.resume_url`. */
  resume: string;
  /** Constant key `availability`; sourced from `profiles.availability_status`. */
  availability: string;
  availabilityText: string;
};

export type HeroStatDto = {
  id: number;
  value: string;
  label: string;
};

/** GET /api/v1/profile payload: the singleton identity plus derived stats. */
export type ProfileDto = {
  personalInfo: PersonalInfoDto;
  heroStats: HeroStatDto[];
};

export type NavLinkDto = {
  id: number;
  url: string;
  label: string;
};

export type SocialLinkDto = {
  id: number;
  name: string;
  url: string;
  icon: string;
};

export type SkillDto = {
  name: string;
  /** Category slug matching the About filter keys (`frontend` | `backend` | `devops`). */
  category: string;
  level: number;
};

export type ProjectMetricDto = {
  value: string;
  label: string;
};

/** Constant key `GitHubUrl` (capital H) is preserved on purpose. */
export type ProjectDto = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  liveUrl: string;
  GitHubUrl: string;
  /** Category slug matching the Projects filter keys (`freelance` | `product`). */
  category: string;
  metrics: ProjectMetricDto;
};

export type ServiceDto = {
  id: number;
  title: string;
  description: string;
  price: string;
  features: string[];
  /** Icon key consumed by Services.tsx getIcon(): `code` | `shopping-cart` | `server` | `consulting`. */
  icon: string;
};

export type ExperienceDto = {
  id: number;
  company: string;
  role: string;
  /** Formatted `"Mar 2023 - Present"` / `"Jan 2020 - Aug 2020"`, matching the constant. */
  period: string;
  description: string;
  technologies: string[];
};

export type ArticleDto = {
  id: number;
  title: string;
  description: string;
  /** Formatted `"Oct 5, 2025"`, matching the constant. */
  date: string;
  /** Formatted `"2 min read"`, matching the constant. */
  readTime: string;
  url: string;
  category: string;
};

export type ContactInfoDto = {
  email: string;
  phone: string;
  location: string;
  /** Constant key `availability`; sourced from `contact_infos.availability_text`. */
  availability: string;
};

const MONTH_YEAR = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const FULL_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** Renders `"Mar 2023"`. */
export function formatMonthYear(date: Date): string {
  return MONTH_YEAR.format(date);
}

/** Renders `"Oct 5, 2025"`. */
export function formatArticleDate(date: Date): string {
  return FULL_DATE.format(date);
}

/** Renders `"2 min read"`. */
export function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}

/** Renders `"Mar 2023 - Present"` when `end` is null. */
export function formatExperiencePeriod(start: Date, end: Date | null): string {
  const endLabel = end === null ? "Present" : formatMonthYear(end);
  return `${formatMonthYear(start)} - ${endLabel}`;
}

/**
 * Replicates the "Years Experience" derivation from `constant/portfolio.ts`
 * (career start 2022-10-01 → `"3+"`), but compares UTC parts so the label is
 * identical on every server regardless of its local time zone.
 */
export function experienceYearsLabel(careerStart: Date): string {
  const today = new Date();
  const years =
    today.getUTCFullYear() -
    careerStart.getUTCFullYear() -
    (today.getUTCMonth() < careerStart.getUTCMonth() ? 1 : 0);
  return `${years}+`;
}
