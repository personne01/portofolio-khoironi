import type { PrismaClient } from "@/lib/generated/prisma/client";
import { db } from "@/lib/db";
import {
  type ArticleDto,
  type ContactInfoDto,
  type ExperienceDto,
  experienceYearsLabel,
  formatArticleDate,
  formatExperiencePeriod,
  formatReadTime,
  type HeroStatDto,
  type NavLinkDto,
  type PersonalInfoDto,
  type ProfileDto,
  type ProjectDto,
  type ServiceDto,
  type SkillDto,
  type SocialLinkDto,
} from "@/lib/dto";
import { notFoundError } from "@/lib/errors";

/**
 * Repository layer: the only place that touches the database. Every function
 * defaults to the shared `db` singleton and optionally accepts a client so the
 * integration tests can point at `TEST_DATABASE_URL` instead.
 */
export type RepositoryClient = PrismaClient;

export async function getProfileData(
  client: RepositoryClient = db,
): Promise<ProfileDto> {
  const profile = await client.profile.findUnique({ where: { id: 1 } });
  if (profile === null) {
    throw notFoundError("Profile not found");
  }

  const personalInfo: PersonalInfoDto = {
    name: profile.name,
    fullName: profile.fullName,
    title: profile.title,
    subtitle: profile.subtitle,
    email: profile.email,
    location: profile.location,
    avatar: profile.photoUrl,
    resume: profile.resumeUrl,
    availability: profile.availabilityStatus,
    availabilityText: profile.availabilityText,
  };

  const heroStats: HeroStatDto[] = [
    {
      id: 1,
      value: experienceYearsLabel(profile.careerStartDate),
      label: "Years Experience",
    },
  ];

  return { personalInfo, heroStats };
}

export async function getNavLinks(
  client: RepositoryClient = db,
): Promise<NavLinkDto[]> {
  const rows = await client.navLink.findMany({
    where: { isVisible: true, deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(({ id, url, label }) => ({ id, url, label }));
}

export async function getSocialLinks(
  client: RepositoryClient = db,
): Promise<SocialLinkDto[]> {
  const rows = await client.socialLink.findMany({
    where: { isVisible: true, deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(({ id, name, url, icon }) => ({ id, name, url, icon }));
}

export async function getSkills(
  client: RepositoryClient = db,
): Promise<SkillDto[]> {
  const categories = await client.skillCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { skills: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } } },
  });

  return categories.flatMap((category) =>
    category.skills.map((skill) => ({
      name: skill.name,
      category: category.slug,
      level: skill.level,
    })),
  );
}

export async function getProjects(
  client: RepositoryClient = db,
): Promise<ProjectDto[]> {
  const rows = await client.project.findMany({
    where: { isPublished: true, deletedAt: null },
    orderBy: { sortOrder: "asc" },
    include: {
      category: true,
      technologies: { orderBy: { sortOrder: "asc" } },
    },
  });

  return rows.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    tags: project.technologies.map((technology) => technology.name),
    liveUrl: project.liveUrl,
    GitHubUrl: project.githubUrl,
    category: project.category.slug,
    metrics: {
      value: project.metricValue,
      label: project.metricLabel,
    },
  }));
}

export async function getProjectBySlug(
  slug: string,
  client: RepositoryClient = db,
): Promise<ProjectDto> {
  const project = await client.project.findFirst({
    where: { slug, isPublished: true, deletedAt: null },
    include: {
      category: true,
      technologies: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (project === null) {
    throw notFoundError(`Project "${slug}" not found`);
  }

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    tags: project.technologies.map((technology) => technology.name),
    liveUrl: project.liveUrl,
    GitHubUrl: project.githubUrl,
    category: project.category.slug,
    metrics: {
      value: project.metricValue,
      label: project.metricLabel,
    },
  };
}

export async function getServices(
  client: RepositoryClient = db,
): Promise<ServiceDto[]> {
  const rows = await client.service.findMany({
    orderBy: { sortOrder: "asc" },
    include: { features: { orderBy: { sortOrder: "asc" } } },
  });

  return rows.map((service) => ({
    id: service.id,
    title: service.title,
    description: service.description,
    price: service.priceDisplay,
    features: service.features.map((feature) => feature.feature),
    icon: service.iconKey,
  }));
}

export async function getExperiences(
  client: RepositoryClient = db,
): Promise<ExperienceDto[]> {
  const rows = await client.experience.findMany({
    where: { isPublished: true, deletedAt: null },
    orderBy: { sortOrder: "asc" },
    include: { technologies: { orderBy: { sortOrder: "asc" } } },
  });

  return rows.map((experience) => ({
    id: experience.id,
    company: experience.company,
    role: experience.role,
    period: formatExperiencePeriod(experience.startDate, experience.endDate),
    description: experience.description,
    technologies: experience.technologies.map((technology) => technology.name),
  }));
}

export async function getArticles(
  client: RepositoryClient = db,
): Promise<ArticleDto[]> {
  const rows = await client.article.findMany({
    where: { isPublished: true, deletedAt: null },
    orderBy: { publishedAt: "desc" },
  });

  return rows.map((article) => ({
    id: article.id,
    title: article.title,
    description: article.description,
    date: formatArticleDate(article.publishedAt),
    readTime: formatReadTime(article.readTimeMinutes),
    url: article.url,
    category: article.category,
  }));
}

export async function getContactInfo(
  client: RepositoryClient = db,
): Promise<ContactInfoDto> {
  const contactInfo = await client.contactInfo.findUnique({ where: { id: 1 } });
  if (contactInfo === null) {
    throw notFoundError("Contact info not found");
  }

  return {
    email: contactInfo.email,
    phone: contactInfo.phone,
    location: contactInfo.location,
    availability: contactInfo.availabilityText,
  };
}
