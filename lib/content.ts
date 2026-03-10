import { JobStatus, Locale, PublishStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type LeadershipItem = {
  id: string;
  slug: string;
  qualificationType: string;
  fullName: string;
  roleTitle: string;
  bio: string | null;
};

type IndustryItem = {
  id: string;
  key: string;
  name: string;
  summary: string | null;
};

type JobItem = {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
};

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: Date | null;
};

function localeToDb(locale: "en" | "id"): Locale {
  return locale === "id" ? Locale.id : Locale.en;
}

function logContentError(scope: string, error: unknown) {
  console.error(`[content] ${scope} failed`, error);
}

export async function getHomePage(locale: "en" | "id") {
  try {
    const page = await prisma.page.findFirst({
      where: { slug: "home", status: PublishStatus.PUBLISHED },
      include: { translations: true },
    });
    if (!page) return null;
    const target = localeToDb(locale);
    return (
      page.translations.find((item) => item.locale === target) ||
      page.translations.find((item) => item.locale === Locale.en) ||
      null
    );
  } catch (error) {
    logContentError("getHomePage", error);
    return null;
  }
}

export async function getLeadership(locale: "en" | "id"): Promise<LeadershipItem[]> {
  try {
    const target = localeToDb(locale);
    const profiles = await prisma.leadershipProfile.findMany({
      where: { isActive: true },
      include: { translations: true },
      orderBy: { sortOrder: "asc" },
    });

    const result: LeadershipItem[] = [];
    for (const profile of profiles) {
      const translation =
        profile.translations.find((item) => item.locale === target) ||
        profile.translations.find((item) => item.locale === Locale.en);
      if (!translation) continue;
      result.push({
        id: profile.id,
        slug: profile.slug,
        qualificationType: profile.qualificationType,
        fullName: translation.fullName,
        roleTitle: translation.roleTitle,
        bio: translation.bio,
      });
    }
    return result;
  } catch (error) {
    logContentError("getLeadership", error);
    return [];
  }
}

export async function getIndustries(locale: "en" | "id"): Promise<IndustryItem[]> {
  try {
    const target = localeToDb(locale);
    const sectors = await prisma.industrySector.findMany({
      where: { isActive: true },
      include: { translations: true },
      orderBy: { sortOrder: "asc" },
    });

    const result: IndustryItem[] = [];
    for (const sector of sectors) {
      const translation =
        sector.translations.find((item) => item.locale === target) ||
        sector.translations.find((item) => item.locale === Locale.en);
      if (!translation) continue;
      result.push({
        id: sector.id,
        key: sector.key,
        name: translation.name,
        summary: translation.summary,
      });
    }
    return result;
  } catch (error) {
    logContentError("getIndustries", error);
    return [];
  }
}

export async function getOpenJobs(locale: "en" | "id"): Promise<JobItem[]> {
  try {
    const target = localeToDb(locale);
    const jobs = await prisma.job.findMany({
      where: { status: JobStatus.OPEN },
      include: { translations: true },
      orderBy: { postedAt: "desc" },
    });

    const result: JobItem[] = [];
    for (const job of jobs) {
      const translation =
        job.translations.find((item) => item.locale === target) ||
        job.translations.find((item) => item.locale === Locale.en);
      if (!translation) continue;
      result.push({
        id: job.id,
        slug: job.slug,
        title: translation.title,
        department: job.department,
        location: job.location,
        employmentType: job.employmentType,
      });
    }
    return result;
  } catch (error) {
    logContentError("getOpenJobs", error);
    return [];
  }
}

export async function getJobBySlug(locale: "en" | "id", slug: string) {
  try {
    const target = localeToDb(locale);
    const job = await prisma.job.findUnique({
      where: { slug },
      include: { translations: true },
    });
    if (!job) return null;
    const translation =
      job.translations.find((item) => item.locale === target) ||
      job.translations.find((item) => item.locale === Locale.en);
    if (!translation) return null;
    return {
      id: job.id,
      title: translation.title,
      description: translation.description,
      requirements: translation.requirements,
      location: job.location,
      department: job.department,
      employmentType: job.employmentType,
      status: job.status,
    };
  } catch (error) {
    logContentError("getJobBySlug", error);
    return null;
  }
}

export async function getNews(locale: "en" | "id"): Promise<NewsItem[]> {
  try {
    const target = localeToDb(locale);
    const posts = await prisma.newsPost.findMany({
      where: { status: PublishStatus.PUBLISHED },
      include: { translations: true },
      orderBy: { publishedAt: "desc" },
    });

    const result: NewsItem[] = [];
    for (const post of posts) {
      const translation =
        post.translations.find((item) => item.locale === target) ||
        post.translations.find((item) => item.locale === Locale.en);
      if (!translation) continue;
      result.push({
        id: post.id,
        slug: post.slug,
        title: translation.title,
        excerpt: translation.excerpt,
        publishedAt: post.publishedAt,
      });
    }
    return result;
  } catch (error) {
    logContentError("getNews", error);
    return [];
  }
}
