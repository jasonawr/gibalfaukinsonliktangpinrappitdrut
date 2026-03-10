import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/en",
    "/en/about",
    "/en/industries",
    "/en/careers",
    "/en/news",
    "/en/contact",
    "/id",
    "/id/about",
    "/id/industries",
    "/id/careers",
    "/id/news",
    "/id/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/en" || route === "/id" ? 1 : 0.7,
  }));
}
