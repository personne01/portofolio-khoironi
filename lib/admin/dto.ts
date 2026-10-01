/**
 * Admin DTOs for the browser. Deliberately separate from `lib/admin/schemas.ts`,
 * which is `server-only`, while the admin UI needs the same field shapes on both
 * sides. Dates cross the wire as ISO-8601 strings, so they are typed as strings
 * here and converted at the form boundary.
 */

export type AdminStats = {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalArticles: number;
  totalSkills: number;
  totalExperiences: number;
};

export type AdminProfile = {
  id: number;
  name: string;
  fullName: string;
  title: string;
  subtitle: string;
  email: string;
  location: string;
  resumeUrl: string;
  photoUrl: string;
  availabilityStatus: string;
  availabilityText: string;
  careerStartDate: string;
};

export type AdminContactInfo = {
  id: number;
  email: string;
  phone: string;
  location: string;
  availabilityText: string;
};

export type AdminNavLink = {
  id: number;
  url: string;
  label: string;
  sortOrder: number;
  isVisible: boolean;
  deletedAt: string | null;
};

export type AdminSocialLink = {
  id: number;
  name: string;
  url: string;
  icon: string;
  sortOrder: number;
  isVisible: boolean;
  deletedAt: string | null;
};

export type AdminSkillCategory = { id: number; slug: string; label: string; sortOrder: number };
export type AdminProjectCategory = { id: number; slug: string; label: string; sortOrder: number };

export type AdminCategories = {
  skills: AdminSkillCategory[];
  projects: AdminProjectCategory[];
};

export type AdminSkill = {
  id: number;
  name: string;
  level: number;
  sortOrder: number;
  categoryId: number;
  category: AdminSkillCategory;
  deletedAt: string | null;
};

export type AdminTechnology = { name: string; sortOrder: number };

export type AdminProject = {
  id: number;
  title: string;
  slug: string;
  description: string;
  liveUrl: string;
  githubUrl: string;
  metricValue: string;
  metricLabel: string;
  sortOrder: number;
  isPublished: boolean;
  categoryId: number;
  category: AdminProjectCategory;
  technologies: AdminTechnology[];
  deletedAt: string | null;
};

export type AdminExperience = {
  id: number;
  company: string;
  role: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  description: string;
  sortOrder: number;
  isPublished: boolean;
  technologies: AdminTechnology[];
  deletedAt: string | null;
};

export type AdminArticle = {
  id: number;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  readTimeMinutes: number;
  category: string;
  sortOrder: number;
  isPublished: boolean;
  deletedAt: string | null;
};

export type LoginResult = {
  username: string;
  session: { id: number; expiresAt: string };
};
