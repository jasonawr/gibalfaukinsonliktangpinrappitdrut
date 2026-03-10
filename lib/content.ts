import { JobStatus, Locale, PublishStatus } from "@prisma/client";

import {
  getFallbackIndustries,
  getFallbackIndustryUpdates,
  getFallbackLeadership,
  getFallbackNews,
} from "@/lib/fallback-content";
import type { AppLocale } from "@/lib/i18n";
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
  imageUrl: string;
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

type IndustryUpdateItem = {
  id: string;
  sector: string;
  title: string;
  summary: string;
  dateLabel: string;
};

type ProjectItem = {
  id: string;
  title: string;
  sector: string;
  summary: string;
  imageUrl: string;
};

type TestimonialItem = {
  id: string;
  quote: string;
  author: string;
  role: string;
};

const industryImages: Record<string, string> = {
  mining:
    "https://images.unsplash.com/photo-1581091215367-59ab6dcef9a4?auto=format&fit=crop&w=1200&q=80",
  "oil-gas":
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
  healthcare:
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
  electrical:
    "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80",
  semiconductor:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  machinery:
    "https://images.unsplash.com/photo-1565120130281-53ff18c6b2d2?auto=format&fit=crop&w=1200&q=80",
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  manufacturing:
    "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=1200&q=80",
  "civil-infrastructure":
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80",
};

function getIndustryImageByKey(key: string) {
  return industryImages[key] || industryImages.manufacturing;
}

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
    return result.length > 0 ? result : getFallbackLeadership(locale);
  } catch (error) {
    logContentError("getLeadership", error);
    return getFallbackLeadership(locale);
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
        imageUrl: getIndustryImageByKey(sector.key),
      });
    }
    return result.length > 0 ? result : getFallbackIndustries(locale);
  } catch (error) {
    logContentError("getIndustries", error);
    return getFallbackIndustries(locale);
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
    return result.length > 0 ? result : getFallbackNews(locale);
  } catch (error) {
    logContentError("getNews", error);
    return getFallbackNews(locale);
  }
}

export async function getIndustryUpdates(
  locale: AppLocale,
): Promise<IndustryUpdateItem[]> {
  const news = await getNews(locale);
  if (news.length > 0) {
    return news.slice(0, 3).map((item) => ({
      id: `iu-${item.id}`,
      sector: locale === "id" ? "Pembaruan Operasional" : "Operational Update",
      title: item.title,
      summary: item.excerpt || (locale === "id" ? "Tidak ada ringkasan." : "No summary available."),
      dateLabel: item.publishedAt
        ? item.publishedAt.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : locale === "id"
          ? "Terbaru"
          : "Latest",
    }));
  }
  return getFallbackIndustryUpdates(locale);
}

export function getFeaturedProjects(locale: AppLocale): ProjectItem[] {
  if (locale === "id") {
    return [
      {
        id: "pr-1",
        title: "Modernisasi Sistem Kelistrikan Industri",
        sector: "Electrical",
        summary:
          "Peningkatan keandalan distribusi daya dan sistem proteksi untuk menurunkan downtime kritis.",
        imageUrl: getIndustryImageByKey("electrical"),
      },
      {
        id: "pr-2",
        title: "Program Efisiensi Terminal Energi",
        sector: "Oil & Gas",
        summary:
          "Optimasi alur operasional terminal meningkatkan throughput dan standar keselamatan.",
        imageUrl: getIndustryImageByKey("oil-gas"),
      },
      {
        id: "pr-3",
        title: "Penguatan Operasi Rumah Sakit DR",
        sector: "Healthcare",
        summary:
          "Integrasi proses klinis dan operasional untuk percepatan waktu respons layanan pasien.",
        imageUrl: getIndustryImageByKey("healthcare"),
      },
    ];
  }

  return [
    {
      id: "pr-1",
      title: "Industrial Electrical Modernization",
      sector: "Electrical",
      summary:
        "Power reliability and protection system upgrades reduced critical downtime across key facilities.",
      imageUrl: getIndustryImageByKey("electrical"),
    },
    {
      id: "pr-2",
      title: "Energy Terminal Efficiency Program",
      sector: "Oil & Gas",
      summary:
        "Terminal workflow optimization improved throughput while strengthening safety compliance.",
      imageUrl: getIndustryImageByKey("oil-gas"),
    },
    {
      id: "pr-3",
      title: "DR Hospital Operational Reinforcement",
      sector: "Healthcare",
      summary:
        "Clinical and operations integration accelerated service response and care continuity.",
      imageUrl: getIndustryImageByKey("healthcare"),
    },
  ];
}

export function getClientTestimonials(locale: AppLocale): TestimonialItem[] {
  if (locale === "id") {
    return [
      {
        id: "ts-1",
        quote:
          "Tim project sangat responsif, disiplin terhadap HSE, dan delivery sesuai target operasi.",
        author: "Operations Manager",
        role: "Mitra Sektor Energi",
      },
      {
        id: "ts-2",
        quote:
          "Pendekatan integrasi lintas fungsi membuat transformasi fasilitas berjalan jauh lebih stabil.",
        author: "Plant Director",
        role: "Mitra Manufaktur",
      },
    ];
  }

  return [
    {
      id: "ts-1",
      quote:
        "The project team was highly responsive, safety-disciplined, and delivered against operational milestones.",
      author: "Operations Manager",
      role: "Energy Sector Partner",
    },
    {
      id: "ts-2",
      quote:
        "Their cross-functional integration approach made our facility transformation significantly more stable.",
      author: "Plant Director",
      role: "Manufacturing Partner",
    },
  ];
}
