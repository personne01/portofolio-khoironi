import "server-only";

import type {
  ArticleDto,
  ContactInfoDto,
  ExperienceDto,
  NavLinkDto,
  ProfileDto,
  ProjectDto,
  ServiceDto,
  SkillDto,
  SocialLinkDto,
} from "@/lib/dto";
import { ApiError } from "@/lib/errors";

/**
 * Server-side REST client used by Server Components. Fetches through the HTTP
 * API (never the database directly). Responses go through the framework data
 * cache and are revalidated every REVALIDATE_SECONDS, while pages force
 * dynamic rendering so every request still gets a server-rendered page.
 */
const API_BASE_URL =
  process.env.API_BASE_URL?.replace(/\/+$/, "") ?? "http://127.0.0.1:3000";

const REVALIDATE_SECONDS = 60;

async function settled<T>(promise: Promise<T>): Promise<T | undefined> {
  try {
    return await promise;
  } catch {
    return undefined;
  }
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: { code?: string; message?: string };
    } | null;
    throw new ApiError(
      response.status,
      body?.error?.code ?? "HTTP_ERROR",
      body?.error?.message ??
        `GET ${path} failed with status ${response.status}`,
    );
  }

  const envelope = (await response.json()) as { data: T };
  return envelope.data;
}

export function fetchProfile(): Promise<ProfileDto> {
  return get<ProfileDto>("/api/v1/profile");
}

export function fetchNavLinks(): Promise<NavLinkDto[]> {
  return get<NavLinkDto[]>("/api/v1/nav-links");
}

export function fetchSocialLinks(): Promise<SocialLinkDto[]> {
  return get<SocialLinkDto[]>("/api/v1/social-links");
}

export function fetchSkills(): Promise<SkillDto[]> {
  return get<SkillDto[]>("/api/v1/skills");
}

export function fetchProjects(): Promise<ProjectDto[]> {
  return get<ProjectDto[]>("/api/v1/projects");
}

export function fetchServices(): Promise<ServiceDto[]> {
  return get<ServiceDto[]>("/api/v1/services");
}

export function fetchExperiences(): Promise<ExperienceDto[]> {
  return get<ExperienceDto[]>("/api/v1/experiences");
}

export function fetchArticles(): Promise<ArticleDto[]> {
  return get<ArticleDto[]>("/api/v1/articles");
}

export function fetchContactInfo(): Promise<ContactInfoDto> {
  return get<ContactInfoDto>("/api/v1/contact-info");
}

/** Everything the home page renders, fetched in one parallel batch. */
export type HomeData = {
  profile: ProfileDto;
  navLinks: NavLinkDto[];
  socialLinks: SocialLinkDto[];
  skills: SkillDto[];
  projects: ProjectDto[];
  services: ServiceDto[];
  experiences: ExperienceDto[];
  articles: ArticleDto[];
  contactInfo: ContactInfoDto;
};

/**
 * Fetches every data slice the home page needs. Each slice is fetched
 * independently, so a failing endpoint yields `undefined` for that slice
 * (components fall back to static content) without failing the whole page.
 */
export async function fetchHomeData(): Promise<Partial<HomeData>> {
  const [
    profile,
    navLinks,
    socialLinks,
    skills,
    projects,
    services,
    experiences,
    articles,
    contactInfo,
  ] = await Promise.all([
    settled(fetchProfile()),
    settled(fetchNavLinks()),
    settled(fetchSocialLinks()),
    settled(fetchSkills()),
    settled(fetchProjects()),
    settled(fetchServices()),
    settled(fetchExperiences()),
    settled(fetchArticles()),
    settled(fetchContactInfo()),
  ]);

  return {
    profile,
    navLinks,
    socialLinks,
    skills,
    projects,
    services,
    experiences,
    articles,
    contactInfo,
  };
}
