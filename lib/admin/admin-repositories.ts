import "server-only";

import type { PrismaClient } from "@/lib/generated/prisma/client";
import { db } from "@/lib/db";
import {
  type ArticleInput,
  type ExperienceInput,
  type NavLinkInput,
  type ProfileInput,
  type ProjectInput,
  type SkillInput,
  type SocialLinkInput,
} from "@/lib/admin/schemas";

/**
 * Admin repository layer: write paths and list paths that include soft-deleted
 * rows for the admin UI. Public getters live in `lib/repositories.ts` and must
 * filter `deletedAt: null`.
 */
export type AdminRepositoryClient = PrismaClient;

const SOFT_DELETE = { deletedAt: { set: new Date() } } as const;
const RESTORE = { deletedAt: { set: null } } as const;

export async function listAdminProjects(
  client: AdminRepositoryClient = db,
  includeDeleted = false,
) {
  return client.project.findMany({
    where: includeDeleted ? {} : { deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: { category: true, technologies: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getAdminProject(id: number, client: AdminRepositoryClient = db) {
  return client.project.findUnique({ where: { id }, include: { category: true, technologies: true } });
}

export async function createProject(data: ProjectInput, client: AdminRepositoryClient = db) {
  return client.project.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      liveUrl: data.liveUrl,
      githubUrl: data.githubUrl,
      metricValue: data.metricValue,
      metricLabel: data.metricLabel,
      sortOrder: data.sortOrder,
      isPublished: data.isPublished,
      categoryId: data.categoryId,
      technologies: {
        create: data.technologies.map((t, index) => ({ name: t.name, sortOrder: t.sortOrder ?? index })),
      },
    },
    include: { technologies: true },
  });
}

export async function updateProject(id: number, data: ProjectInput, client: AdminRepositoryClient = db) {
  return client.project.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      liveUrl: data.liveUrl,
      githubUrl: data.githubUrl,
      metricValue: data.metricValue,
      metricLabel: data.metricLabel,
      sortOrder: data.sortOrder,
      isPublished: data.isPublished,
      categoryId: data.categoryId,
      technologies: {
        deleteMany: {},
        create: data.technologies.map((t, index) => ({ name: t.name, sortOrder: t.sortOrder ?? index })),
      },
    },
    include: { technologies: true },
  });
}

export async function softDeleteProject(id: number, client: AdminRepositoryClient = db) {
  return client.project.update({ where: { id }, data: SOFT_DELETE });
}

export async function restoreProject(id: number, client: AdminRepositoryClient = db) {
  return client.project.update({ where: { id }, data: RESTORE });
}

export async function listAdminSkills(client: AdminRepositoryClient = db, includeDeleted = false) {
  return client.skill.findMany({
    where: includeDeleted ? {} : { deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: { category: true },
  });
}

export async function getAdminSkill(id: number, client: AdminRepositoryClient = db) {
  return client.skill.findUnique({ where: { id }, include: { category: true } });
}

export async function createSkill(data: SkillInput, client: AdminRepositoryClient = db) {
  return client.skill.create({ data });
}

export async function updateSkill(id: number, data: SkillInput, client: AdminRepositoryClient = db) {
  return client.skill.update({ where: { id }, data });
}

export async function softDeleteSkill(id: number, client: AdminRepositoryClient = db) {
  return client.skill.update({ where: { id }, data: SOFT_DELETE });
}

export async function restoreSkill(id: number, client: AdminRepositoryClient = db) {
  return client.skill.update({ where: { id }, data: RESTORE });
}

export async function listAdminExperiences(client: AdminRepositoryClient = db, includeDeleted = false) {
  return client.experience.findMany({
    where: includeDeleted ? {} : { deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: { technologies: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getAdminExperience(id: number, client: AdminRepositoryClient = db) {
  return client.experience.findUnique({ where: { id }, include: { technologies: true } });
}

export async function createExperience(data: ExperienceInput, client: AdminRepositoryClient = db) {
  return client.experience.create({
    data: {
      company: data.company,
      role: data.role,
      location: data.location ?? null,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
      description: data.description,
      sortOrder: data.sortOrder,
      isPublished: data.isPublished,
      technologies: {
        create: data.technologies.map((t, index) => ({ name: t.name, sortOrder: t.sortOrder ?? index })),
      },
    },
    include: { technologies: true },
  });
}

export async function updateExperience(id: number, data: ExperienceInput, client: AdminRepositoryClient = db) {
  return client.experience.update({
    where: { id },
    data: {
      company: data.company,
      role: data.role,
      location: data.location ?? null,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
      description: data.description,
      sortOrder: data.sortOrder,
      isPublished: data.isPublished,
      technologies: {
        deleteMany: {},
        create: data.technologies.map((t, index) => ({ name: t.name, sortOrder: t.sortOrder ?? index })),
      },
    },
    include: { technologies: true },
  });
}

export async function softDeleteExperience(id: number, client: AdminRepositoryClient = db) {
  return client.experience.update({ where: { id }, data: SOFT_DELETE });
}

export async function restoreExperience(id: number, client: AdminRepositoryClient = db) {
  return client.experience.update({ where: { id }, data: RESTORE });
}

export async function listAdminArticles(client: AdminRepositoryClient = db, includeDeleted = false) {
  return client.article.findMany({
    where: includeDeleted ? {} : { deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }, { id: "asc" }],
  });
}

export async function getAdminArticle(id: number, client: AdminRepositoryClient = db) {
  return client.article.findUnique({ where: { id } });
}

export async function createArticle(data: ArticleInput, client: AdminRepositoryClient = db) {
  return client.article.create({ data });
}

export async function updateArticle(id: number, data: ArticleInput, client: AdminRepositoryClient = db) {
  return client.article.update({ where: { id }, data });
}

export async function softDeleteArticle(id: number, client: AdminRepositoryClient = db) {
  return client.article.update({ where: { id }, data: SOFT_DELETE });
}

export async function restoreArticle(id: number, client: AdminRepositoryClient = db) {
  return client.article.update({ where: { id }, data: RESTORE });
}

export async function getProfileSingleton(client: AdminRepositoryClient = db) {
  return client.profile.findUnique({ where: { id: 1 } });
}

export async function updateProfile(data: ProfileInput, client: AdminRepositoryClient = db) {
  return client.profile.update({
    where: { id: 1 },
    data: {
      name: data.name,
      fullName: data.fullName,
      title: data.title,
      subtitle: data.subtitle,
      email: data.email,
      location: data.location,
      resumeUrl: data.resumeUrl,
      photoUrl: data.photoUrl,
      availabilityStatus: data.availabilityStatus,
      availabilityText: data.availabilityText,
      careerStartDate: data.careerStartDate,
    },
  });
}

export async function getContactInfoSingleton(client: AdminRepositoryClient = db) {
  return client.contactInfo.findUnique({ where: { id: 1 } });
}

export async function updateContactInfo(
  data: { email: string; phone: string; location: string; availabilityText: string },
  client: AdminRepositoryClient = db,
) {
  return client.contactInfo.update({
    where: { id: 1 },
    data: {
      email: data.email,
      phone: data.phone,
      location: data.location,
      availabilityText: data.availabilityText,
    },
  });
}

export async function listAdminNavLinks(client: AdminRepositoryClient = db, includeDeleted = false) {
  return client.navLink.findMany({
    where: includeDeleted ? {} : { deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
}

export async function getAdminNavLink(id: number, client: AdminRepositoryClient = db) {
  return client.navLink.findUnique({ where: { id } });
}

export async function createNavLink(data: NavLinkInput, client: AdminRepositoryClient = db) {
  return client.navLink.create({ data });
}

export async function updateNavLink(id: number, data: NavLinkInput, client: AdminRepositoryClient = db) {
  return client.navLink.update({ where: { id }, data });
}

export async function softDeleteNavLink(id: number, client: AdminRepositoryClient = db) {
  return client.navLink.update({ where: { id }, data: SOFT_DELETE });
}

export async function restoreNavLink(id: number, client: AdminRepositoryClient = db) {
  return client.navLink.update({ where: { id }, data: RESTORE });
}

export async function listAdminSocialLinks(client: AdminRepositoryClient = db, includeDeleted = false) {
  return client.socialLink.findMany({
    where: includeDeleted ? {} : { deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
}

export async function getAdminSocialLink(id: number, client: AdminRepositoryClient = db) {
  return client.socialLink.findUnique({ where: { id } });
}

export async function createSocialLink(data: SocialLinkInput, client: AdminRepositoryClient = db) {
  return client.socialLink.create({ data });
}

export async function updateSocialLink(id: number, data: SocialLinkInput, client: AdminRepositoryClient = db) {
  return client.socialLink.update({ where: { id }, data });
}

export async function softDeleteSocialLink(id: number, client: AdminRepositoryClient = db) {
  return client.socialLink.update({ where: { id }, data: SOFT_DELETE });
}

export async function restoreSocialLink(id: number, client: AdminRepositoryClient = db) {
  return client.socialLink.update({ where: { id }, data: RESTORE });
}

export async function listSkillCategories(client: AdminRepositoryClient = db) {
  return client.skillCategory.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
}

export async function listProjectCategories(client: AdminRepositoryClient = db) {
  return client.projectCategory.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
}

export async function getAdminStats(client: AdminRepositoryClient = db) {  const [
    totalProjects,
    publishedProjects,
    draftProjects,
    totalArticles,
    totalSkills,
    totalExperiences,
  ] = await client.$transaction([
    client.project.count({ where: { deletedAt: null } }),
    client.project.count({ where: { deletedAt: null, isPublished: true } }),
    client.project.count({ where: { deletedAt: null, isPublished: false } }),
    client.article.count({ where: { deletedAt: null } }),
    client.skill.count({ where: { deletedAt: null } }),
    client.experience.count({ where: { deletedAt: null } }),
  ]);
  return { totalProjects, publishedProjects, draftProjects, totalArticles, totalSkills, totalExperiences };
}
export async function findAdminUserByUsername(username: string, client: AdminRepositoryClient = db) {
  return client.adminUser.findUnique({ where: { username } });
}

export type NewAdminUser = { username: string; passwordHash: string; passwordSalt: string };

export async function createAdminUser(data: NewAdminUser, client: AdminRepositoryClient = db) {
  return client.adminUser.create({ data });
}

export async function countAdminUsers(client: AdminRepositoryClient = db) {
  return client.adminUser.count();
}
