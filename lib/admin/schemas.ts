import "server-only";

import { z } from "zod";

const nonEmpty = (field: string) => z.string().trim().min(1, `${field} must not be empty`);

const slug = () => z.string().trim().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case");

const sortOrder = () => z.number().int().nonnegative();

const isPublished = () => z.boolean();

const isVisible = () => z.boolean();

/**
 * Three accepted shapes, per the admin URL rule: an absolute `https://` URL, a
 * root-relative path (`/projects`), or a `#fragment`. Plain `http://` and
 * protocol-relative values are rejected so links cannot be downgraded.
 */
const url = () =>
  z
    .string()
    .trim()
    .min(1, "Must not be empty")
    .refine(
      (value) => {
        // "//host" is protocol-relative: browsers resolve it to https://host, so it
        // must be rejected before the "/path" case below accepts it.
        if (value.startsWith("//")) return false;
        if (value.startsWith("#")) return /^#[A-Za-z0-9_-]*$/.test(value);
        if (value.startsWith("/")) return true;
        try {
          return new URL(value).protocol === "https:";
        } catch {
          return false;
        }
      },
      { error: "Must be an https:// URL, a path starting with /, or a #fragment" },
    );

/** Exact `YYYY-MM-DD`, returned as UTC midnight so no local offset can shift it. */
const utcDate = (label: string) =>
  z.iso.date({ error: `${label} must be YYYY-MM-DD` }).transform((value) => new Date(`${value}T00:00:00.000Z`));

const hexOfLength = (len: number) => z.string().regex(new RegExp(`^[0-9a-f]{${len}}$`), "Invalid hex");

export const loginSchema = z.object({
  username: nonEmpty("Username"),
  password: z.string().min(1, "Password must not be empty"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const profileSchema = z.object({
  name: nonEmpty("Name"),
  fullName: nonEmpty("Full name"),
  title: nonEmpty("Title"),
  subtitle: nonEmpty("Subtitle"),
  email: z.string().trim().email("Invalid email"),
  location: nonEmpty("Location"),
  resumeUrl: url(),
  photoUrl: url(),
  availabilityStatus: nonEmpty("Availability status"),
  availabilityText: nonEmpty("Availability text"),
  careerStartDate: utcDate("Career start date"),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const contactInfoSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  phone: nonEmpty("Phone"),
  location: nonEmpty("Location"),
  availabilityText: nonEmpty("Availability text"),
});

export type ContactInfoInput = z.infer<typeof contactInfoSchema>;

export const navLinkSchema = z.object({
  url: url(),
  label: nonEmpty("Label"),
  sortOrder: sortOrder(),
  isVisible: isVisible(),
});

export type NavLinkInput = z.infer<typeof navLinkSchema>;

export const socialLinkSchema = z.object({
  name: nonEmpty("Name"),
  url: url(),
  icon: nonEmpty("Icon"),
  sortOrder: sortOrder(),
  isVisible: isVisible(),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;

export const skillSchema = z.object({
  name: nonEmpty("Name"),
  level: z.number().int().min(0).max(100),
  sortOrder: sortOrder(),
  categoryId: z.number().int().positive(),
});

export type SkillInput = z.infer<typeof skillSchema>;

export const projectTechnologySchema = z.object({
  name: nonEmpty("Technology name"),
  sortOrder: sortOrder(),
});

export const projectSchema = z.object({
  title: nonEmpty("Title"),
  slug: slug(),
  description: nonEmpty("Description"),
  liveUrl: url(),
  githubUrl: url(),
  metricValue: nonEmpty("Metric value"),
  metricLabel: nonEmpty("Metric label"),
  sortOrder: sortOrder(),
  isPublished: isPublished(),
  categoryId: z.number().int().positive(),
  technologies: z.array(projectTechnologySchema).min(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const experienceTechnologySchema = z.object({
  name: nonEmpty("Technology name"),
  sortOrder: sortOrder(),
});

export const experienceSchema = z.object({
  company: nonEmpty("Company"),
  role: nonEmpty("Role"),
  location: z.string().trim().nullish(),
  startDate: utcDate("Start date"),
  endDate: utcDate("End date").nullish(),
  description: nonEmpty("Description"),
  sortOrder: sortOrder(),
  isPublished: isPublished(),
  technologies: z.array(experienceTechnologySchema).min(0),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;

export const articleSchema = z.object({
  title: nonEmpty("Title"),
  description: nonEmpty("Description"),
  url: url(),
  publishedAt: utcDate("Published date"),
  readTimeMinutes: z.number().int().nonnegative(),
  category: nonEmpty("Category"),
  sortOrder: sortOrder(),
  isPublished: isPublished(),
});

export type ArticleInput = z.infer<typeof articleSchema>;

const SESSION_TOKEN_BYTES = 32;
const PASSWORD_KEY_BYTES = 64;
const PASSWORD_SALT_BYTES = 16;

const HEX_CHARACTERS_PER_BYTE = 2;

export const sessionTokenHexSchema = hexOfLength(SESSION_TOKEN_BYTES * HEX_CHARACTERS_PER_BYTE);
export const passwordHashSchema = hexOfLength(PASSWORD_KEY_BYTES * HEX_CHARACTERS_PER_BYTE);
export const passwordSaltSchema = hexOfLength(PASSWORD_SALT_BYTES * HEX_CHARACTERS_PER_BYTE);

export const softDeleteIdSchema = z.object({
  id: z.number().int().positive(),
});

export type SoftDeleteId = z.infer<typeof softDeleteIdSchema>;