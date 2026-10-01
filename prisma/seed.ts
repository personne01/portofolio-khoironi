/**
 * Seeds the database from the portfolio's real content in
 * `constant/portfolio.ts`.
 *
 * Run with:  ALLOW_DESTRUCTIVE_SEED=1 npx prisma db seed
 *
 * DESTRUCTIVE: this truncates all 14 content tables, including everything the
 * admin CMS writes. `seed-guard.ts` refuses to run unless the environment opts
 * in explicitly and the target host is not a production database.
 *
 * The seed is idempotent: it clears the content tables in foreign-key-safe
 * order and re-inserts, so re-running it always converges on the same state.
 *
 * Note: this script deliberately does NOT import `@/lib/db`, because that
 * module is marked `server-only` and throws when evaluated outside the
 * `react-server` condition. The seed therefore builds its own client.
 */
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { assertDestructiveSeedAllowed } from "./seed-guard";

import {
  contactInfo,
  experience,
  mediumArticles,
  navLinks,
  personalInfo,
  projects,
  services,
  skills,
  socialLinks,
} from "@/constant/portfolio";
import { PrismaClient } from "@/lib/generated/prisma/client";

const MONTH_INDEX: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

/**
 * Builds a UTC date for a `@db.Date` column. UTC is used deliberately: the
 * app runs in Asia/Jakarta, and constructing a local midnight date would be
 * stored as the previous day for any timezone behind UTC.
 */
function utcDate(year: number, month: number, day = 1): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

/** Parses the experience period format used in the source data. */
function parseExperiencePeriod(period: string): {
  startDate: Date;
  endDate: Date | null;
} {
  const [rawStart, rawEnd] = period.split("-").map((part) => part.trim());

  if (rawStart === undefined || rawEnd === undefined) {
    throw new Error(`Unrecognised experience period: "${period}"`);
  }

  const startMatch = /^([A-Za-z]{3})\s+(\d{4})$/.exec(rawStart);
  if (startMatch === null) {
    throw new Error(`Unrecognised experience start date: "${rawStart}"`);
  }

  const startDate = utcDate(
    Number(startMatch[2]),
    monthNumber(startMatch[1], rawStart),
  );

  if (rawEnd.toLowerCase() === "present") {
    return { startDate, endDate: null };
  }

  const endMatch = /^([A-Za-z]{3})\s+(\d{4})$/.exec(rawEnd);
  if (endMatch === null) {
    throw new Error(`Unrecognised experience end date: "${rawEnd}"`);
  }

  return {
    startDate,
    endDate: utcDate(Number(endMatch[2]), monthNumber(endMatch[1], rawEnd)),
  };
}

/** Parses the article date format used in the source data, e.g. "Oct 5, 2025". */
function parseArticleDate(value: string): Date {
  const match = /^([A-Za-z]{3})\s+(\d{1,2}),\s*(\d{4})$/.exec(value);

  if (match === null) {
    throw new Error(`Unrecognised article date: "${value}"`);
  }

  return utcDate(
    Number(match[3]),
    monthNumber(match[1], value),
    Number(match[2]),
  );
}

/** Parses the read-time format used in the source data, e.g. "2 min read". */
function parseReadTimeMinutes(value: string): number {
  const match = /^(\d+)\s*min/.exec(value);

  if (match === null) {
    throw new Error(`Unrecognised article read time: "${value}"`);
  }

  return Number(match[1]);
}

function monthNumber(token: string, source: string): number {
  const month = MONTH_INDEX[token.toLowerCase()];

  if (month === undefined) {
    throw new Error(`Unrecognised month "${token}" in "${source}"`);
  }

  return month;
}

function slugify(value: string): string {
  const slug = value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");

  if (slug === "") {
    throw new Error(`Cannot derive a slug from "${value}"`);
  }

  return slug;
}

const CATEGORY_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  devops: "DevOps",
  freelance: "Freelance",
  product: "Product",
};

function categoryLabel(slug: string): string {
  const known = CATEGORY_LABELS[slug];

  if (known !== undefined) {
    return known;
  }

  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

/**
 * The source data exposes a dead `/avatar.png` path. This is the image that
 * actually exists in `public/`, so it is the value stored in the database.
 */
const PROFILE_PHOTO_URL = "/photos/khoironi-photo.jpeg";

/** Backs the "Years Experience" hero stat, which is derived at render time. */
const CAREER_START_DATE = utcDate(2022, 10);

async function main(): Promise<void> {
  // Refused before any client is constructed, so a rejected run opens no
  // connection and deletes nothing. Prints the host, never the DSN, which
  // carries an inline password.
  const target = assertDestructiveSeedAllowed({
    DATABASE_URL: process.env["DATABASE_URL"],
    NODE_ENV: process.env["NODE_ENV"],
    ALLOW_DESTRUCTIVE_SEED: process.env["ALLOW_DESTRUCTIVE_SEED"],
  });

  console.log(
    `Seeding "${target.host}": truncating all content tables, then re-inserting.`,
  );

  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: target.connectionString }),
  });

  try {
    // Child rows first so the ON DELETE RESTRICT constraints never fire.
    await db.$transaction([
      db.serviceFeature.deleteMany(),
      db.projectTechnology.deleteMany(),
      db.experienceTechnology.deleteMany(),
      db.skill.deleteMany(),
      db.project.deleteMany(),
      db.experience.deleteMany(),
      db.article.deleteMany(),
      db.service.deleteMany(),
      db.socialLink.deleteMany(),
      db.navLink.deleteMany(),
      db.skillCategory.deleteMany(),
      db.projectCategory.deleteMany(),
      db.contactInfo.deleteMany(),
      db.profile.deleteMany(),
    ]);

    await db.profile.create({
      data: {
        id: 1,
        name: personalInfo.name,
        fullName: personalInfo.fullName,
        title: personalInfo.title,
        subtitle: personalInfo.subtitle,
        email: personalInfo.email,
        location: personalInfo.location,
        resumeUrl: personalInfo.resume,
        photoUrl: PROFILE_PHOTO_URL,
        availabilityStatus: personalInfo.availability,
        availabilityText: personalInfo.availabilityText,
        careerStartDate: CAREER_START_DATE,
      },
    });

    await db.contactInfo.create({
      data: {
        id: 1,
        email: contactInfo.email,
        phone: contactInfo.phone,
        location: contactInfo.location,
        availabilityText: contactInfo.availability,
      },
    });

    // The `#testimonials` entry points at a section that is not rendered
    // (no testimonials table), so it is preserved but hidden rather than
    // deleted: the anchor is part of the real navigation data.
    await db.navLink.createMany({
      data: navLinks.map((link) => ({
        url: link.url,
        label: link.label,
        sortOrder: link.id,
        isVisible: link.url !== "#testimonials",
      })),
    });

    await db.socialLink.createMany({
      data: socialLinks.map((link) => ({
        name: link.name,
        url: link.url,
        icon: link.icon,
        sortOrder: link.id,
      })),
    });

    const skillCategories = [...new Set(skills.map((skill) => skill.category))];
    const skillCategoryIds = new Map<string, number>();

    for (const [index, slug] of skillCategories.entries()) {
      const created = await db.skillCategory.create({
        data: { slug, label: categoryLabel(slug), sortOrder: index + 1 },
      });
      skillCategoryIds.set(slug, created.id);
    }

    await db.skill.createMany({
      data: skills.map((skill, index) => {
        const categoryId = skillCategoryIds.get(skill.category);

        if (categoryId === undefined) {
          throw new Error(`Missing skill category "${skill.category}"`);
        }

        return {
          name: skill.name,
          level: skill.level,
          sortOrder: index + 1,
          categoryId,
        };
      }),
    });

    const projectCategories = [
      ...new Set(projects.map((project) => project.category)),
    ];
    const projectCategoryIds = new Map<string, number>();

    for (const [index, slug] of projectCategories.entries()) {
      const created = await db.projectCategory.create({
        data: { slug, label: categoryLabel(slug), sortOrder: index + 1 },
      });
      projectCategoryIds.set(slug, created.id);
    }

    const createdProjects = await db.project.createManyAndReturn({
      data: projects.map((project, index) => {
        const categoryId = projectCategoryIds.get(project.category);

        if (categoryId === undefined) {
          throw new Error(`Missing project category "${project.category}"`);
        }

        return {
          title: project.title,
          slug: slugify(project.title),
          description: project.description,
          liveUrl: project.liveUrl,
          githubUrl: project.GitHubUrl,
          metricValue: project.metrics.value,
          metricLabel: project.metrics.label,
          sortOrder: index + 1,
          categoryId,
        };
      }),
    });

    // createManyAndReturn preserves input order, so index alignment is safe.
    await db.projectTechnology.createMany({
      data: createdProjects.flatMap((project, index) => {
        const source = projects[index];

        if (source === undefined) {
          throw new Error(`Missing source project at index ${index}`);
        }

        return source.tags.map((name, tagIndex) => ({
          projectId: project.id,
          name,
          sortOrder: tagIndex + 1,
        }));
      }),
    });

    const createdServices = await db.service.createManyAndReturn({
      data: services.map((service, index) => ({
        title: service.title,
        description: service.description,
        priceDisplay: service.price,
        iconKey: service.icon,
        sortOrder: index + 1,
      })),
    });

    await db.serviceFeature.createMany({
      data: createdServices.flatMap((service, index) => {
        const source = services[index];

        if (source === undefined) {
          throw new Error(`Missing source service at index ${index}`);
        }

        return source.features.map((feature, featureIndex) => ({
          serviceId: service.id,
          feature,
          sortOrder: featureIndex + 1,
        }));
      }),
    });

    const createdExperiences = await db.experience.createManyAndReturn({
      data: experience.map((item, index) => {
        const { startDate, endDate } = parseExperiencePeriod(item.period);

        return {
          company: item.company,
          role: item.role,
          // The source data carries no location for either role.
          location: null,
          startDate,
          endDate,
          description: item.description,
          sortOrder: index + 1,
        };
      }),
    });

    await db.experienceTechnology.createMany({
      data: createdExperiences.flatMap((item, index) => {
        const source = experience[index];

        if (source === undefined) {
          throw new Error(`Missing source experience at index ${index}`);
        }

        return source.technologies.map((name, techIndex) => ({
          experienceId: item.id,
          name,
          sortOrder: techIndex + 1,
        }));
      }),
    });

    await db.article.createMany({
      data: mediumArticles.map((article, index) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        publishedAt: parseArticleDate(article.date),
        readTimeMinutes: parseReadTimeMinutes(article.readTime),
        category: article.category,
        sortOrder: index + 1,
      })),
    });

    const counts = {
      profiles: await db.profile.count(),
      navLinks: await db.navLink.count(),
      socialLinks: await db.socialLink.count(),
      skillCategories: await db.skillCategory.count(),
      skills: await db.skill.count(),
      projectCategories: await db.projectCategory.count(),
      projects: await db.project.count(),
      projectTechnologies: await db.projectTechnology.count(),
      services: await db.service.count(),
      serviceFeatures: await db.serviceFeature.count(),
      experiences: await db.experience.count(),
      experienceTechnologies: await db.experienceTechnology.count(),
      articles: await db.article.count(),
      contactInfos: await db.contactInfo.count(),
    };

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

    console.log("Seed complete:");
    for (const [table, count] of Object.entries(counts)) {
      console.log(`  ${table.padEnd(24)} ${count}`);
    }
    console.log(`  ${"TOTAL".padEnd(24)} ${total}`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
