import type { MetadataRoute } from "next";
import { getAuthors, getStories, getTopics } from "@/lib/cms/repository";
import { locales, localizedPath } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";

const staticPaths = ["", "/news", "/history", "/topics", "/about", "/search", "/contact", "/newsletter", "/privacy", "/terms"];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    const [stories, topics, authors] = await Promise.all([
      getStories(locale),
      getTopics(locale),
      getAuthors(locale),
    ]);
    for (const path of staticPaths) {
      entries.push({
        url: absoluteUrl(localizedPath(locale, path)),
        changeFrequency: path === "" || path === "/news" ? "hourly" : "weekly",
        priority: path === "" ? 1 : 0.7,
      });
    }
    for (const topic of topics) {
      entries.push({
        url: absoluteUrl(localizedPath(locale, `/topics/${topic.slug}`)),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
    for (const story of stories) {
      entries.push({
        url: absoluteUrl(localizedPath(locale, `/news/${story.slug}`)),
        lastModified: story.updatedAt || story.publishedAt || undefined,
        changeFrequency: "weekly",
        priority: story.featured ? 0.9 : 0.7,
      });
    }
    for (const author of authors) {
      entries.push({
        url: absoluteUrl(localizedPath(locale, `/authors/${author.slug}`)),
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
  }
  return entries;
}
