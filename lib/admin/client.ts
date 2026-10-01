"use client";

/**
 * Browser-side client for the admin API. The admin UI never touches Prisma or
 * PostgreSQL directly — every read and write goes through `/api/v1/admin/*`,
 * which re-validates input server-side and owns auth/CSRF.
 */

import type {
  AdminArticle,
  AdminCategories,
  AdminContactInfo,
  AdminExperience,
  AdminNavLink,
  AdminProfile,
  AdminProject,
  AdminSkill,
  AdminSocialLink,
  AdminStats,
  LoginResult,
} from "@/lib/admin/dto";

const BASE = "/api/v1/admin";

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
  }
}

type Envelope<T> = { data: T } | { error: { code: string; message: string } };

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "same-origin",
    headers: init.body === undefined ? init.headers : { "content-type": "application/json", ...init.headers },
  });

  let body: Envelope<T> | null = null;
  try {
    body = (await response.json()) as Envelope<T>;
  } catch {
    body = null;
  }

  if (!response.ok || body === null || "error" in body) {
    const error = body !== null && "error" in body ? body.error : null;
    // Exempting /auth/login keeps invalid-credential 401s reporting in the form
    // instead of redirecting away from the page the operator needs to fix.
    if (response.status === 401 && !path.startsWith("/auth/login")) {
      window.location.replace("/admin/login");
    }
    throw new ApiClientError(
      response.status,
      error?.code ?? "UNKNOWN",
      error?.message ?? `Request failed with status ${response.status}`,
    );
  }
  return body.data;
}

const json = (value: unknown) => JSON.stringify(value);

const deletedQuery = (includeDeleted: boolean) => (includeDeleted ? "?includeDeleted=true" : "");

export const adminApi = {
  login: (username: string, password: string) =>
    request<LoginResult>("/auth/login", { method: "POST", body: json({ username, password }) }),

  logout: () => request<{ success: boolean }>("/auth/logout", { method: "POST" }),

  me: () => request<{ username: string }>("/auth/me"),

  stats: () => request<AdminStats>("/stats"),

  categories: () => request<AdminCategories>("/categories"),

  getProfile: () => request<AdminProfile>("/profile"),
  updateProfile: (input: Omit<AdminProfile, "id" | "careerStartDate"> & { careerStartDate: string }) =>
    request<AdminProfile>("/profile", { method: "PUT", body: json(input) }),

  getContactInfo: () => request<AdminContactInfo>("/contact-info"),
  updateContactInfo: (input: Omit<AdminContactInfo, "id">) =>
    request<AdminContactInfo>("/contact-info", { method: "PUT", body: json(input) }),

  listProjects: (includeDeleted = false) => request<AdminProject[]>(`/projects${deletedQuery(includeDeleted)}`),
  createProject: (input: unknown) => request<AdminProject>("/projects", { method: "POST", body: json(input) }),
  updateProject: (id: number, input: unknown) =>
    request<AdminProject>(`/projects/${id}`, { method: "PUT", body: json(input) }),
  deleteProject: (id: number) => request<AdminProject>(`/projects/${id}`, { method: "DELETE" }),
  restoreProject: (id: number) => request<AdminProject>(`/projects/${id}/restore`, { method: "POST" }),

  listSkills: (includeDeleted = false) => request<AdminSkill[]>(`/skills${deletedQuery(includeDeleted)}`),
  createSkill: (input: unknown) => request<AdminSkill>("/skills", { method: "POST", body: json(input) }),
  updateSkill: (id: number, input: unknown) =>
    request<AdminSkill>(`/skills/${id}`, { method: "PUT", body: json(input) }),
  deleteSkill: (id: number) => request<AdminSkill>(`/skills/${id}`, { method: "DELETE" }),
  restoreSkill: (id: number) => request<AdminSkill>(`/skills/${id}/restore`, { method: "POST" }),

  listExperiences: (includeDeleted = false) =>
    request<AdminExperience[]>(`/experiences${deletedQuery(includeDeleted)}`),
  createExperience: (input: unknown) =>
    request<AdminExperience>("/experiences", { method: "POST", body: json(input) }),
  updateExperience: (id: number, input: unknown) =>
    request<AdminExperience>(`/experiences/${id}`, { method: "PUT", body: json(input) }),
  deleteExperience: (id: number) => request<AdminExperience>(`/experiences/${id}`, { method: "DELETE" }),
  restoreExperience: (id: number) =>
    request<AdminExperience>(`/experiences/${id}/restore`, { method: "POST" }),

  listArticles: (includeDeleted = false) => request<AdminArticle[]>(`/articles${deletedQuery(includeDeleted)}`),
  createArticle: (input: unknown) => request<AdminArticle>("/articles", { method: "POST", body: json(input) }),
  updateArticle: (id: number, input: unknown) =>
    request<AdminArticle>(`/articles/${id}`, { method: "PUT", body: json(input) }),
  deleteArticle: (id: number) => request<AdminArticle>(`/articles/${id}`, { method: "DELETE" }),
  restoreArticle: (id: number) => request<AdminArticle>(`/articles/${id}/restore`, { method: "POST" }),

  listNavLinks: (includeDeleted = false) => request<AdminNavLink[]>(`/nav-links${deletedQuery(includeDeleted)}`),
  createNavLink: (input: unknown) => request<AdminNavLink>("/nav-links", { method: "POST", body: json(input) }),
  updateNavLink: (id: number, input: unknown) =>
    request<AdminNavLink>(`/nav-links/${id}`, { method: "PUT", body: json(input) }),
  deleteNavLink: (id: number) => request<AdminNavLink>(`/nav-links/${id}`, { method: "DELETE" }),
  restoreNavLink: (id: number) => request<AdminNavLink>(`/nav-links/${id}/restore`, { method: "POST" }),

  listSocialLinks: (includeDeleted = false) =>
    request<AdminSocialLink[]>(`/social-links${deletedQuery(includeDeleted)}`),
  createSocialLink: (input: unknown) =>
    request<AdminSocialLink>("/social-links", { method: "POST", body: json(input) }),
  updateSocialLink: (id: number, input: unknown) =>
    request<AdminSocialLink>(`/social-links/${id}`, { method: "PUT", body: json(input) }),
  deleteSocialLink: (id: number) => request<AdminSocialLink>(`/social-links/${id}`, { method: "DELETE" }),
  restoreSocialLink: (id: number) => request<AdminSocialLink>(`/social-links/${id}/restore`, { method: "POST" }),
};
