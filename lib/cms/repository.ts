import { cache } from "react";
import "server-only";
import { getPayload, type Where } from "payload";
import config from "@/payload.config";
import { stories as fallbackStories, topics as fallbackTopicNames } from "@/lib/content";
import type { Story, StoryMedia } from "@/lib/content";
import { type Locale } from "@/lib/i18n";
import type { CmsAuthor, CmsStory, CmsTopic } from "./types";

/**
 * Server-only CMS boundary. Queries are intentionally request-time database
 * reads; route-level caching/revalidation should be added when the publish
 * webhook is available. React.cache only deduplicates a client/config lookup
 * during one render and does not make content globally stale.
 */

type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
  [key: string]: unknown;
};

type PayloadMedia = {
  url?: string | null;
  cloudinarySecureUrl?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  caption?: string | null;
};

type PayloadTopic = { id: number | string; name?: string | Record<string, string>; slug: string };
type PayloadAuthor = { id: number | string; name?: string | Record<string, string>; bio?: string | Record<string, string> | null; avatar?: number | string | PayloadMedia | null };
type PayloadArticle = {
  id: number | string;
  title?: string | Record<string, string>;
  slug: string;
  excerpt?: string | Record<string, string>;
  body?: { root?: LexicalNode } | null;
  category?: number | string | { id: number | string; name?: string | Record<string, string>; slug: string } | null;
  topics?: (number | string | PayloadTopic)[] | null;
  author?: number | string | PayloadAuthor | null;
  coverImage?: number | string | PayloadMedia | null;
  featured?: boolean | null;
  caption?: string | Record<string, string> | null;
  seoTitle?: string | Record<string, string> | null;
  seoDescription?: string | Record<string, string> | null;
  publishedAt?: string | null;
  updatedAt?: string;
  _status?: "draft" | "published" | null;
};

const getPayloadClient = cache(async () => getPayload({ config }));
const shouldPropagateCmsError = () => process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build";
const canQueryCmsDuringBuild = process.env.CMS_BUILD_DATA === "true";
const cmsReadTimeoutMs = 1800;

async function withCmsReadTimeout<T>(operation: Promise<T>): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`CMS read timed out after ${cmsReadTimeoutMs}ms`)), cmsReadTimeoutMs);
  });

  try {
    return await Promise.race([operation, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
const fallbackTopics = (): CmsTopic[] => {
  const labels: Record<string, Record<Locale, string>> = {
    egypt: { ar: "مصر", en: "Egypt" },
    history: { ar: "التاريخ", en: "History" },
    "coptic-heritage": { ar: "التراث القبطي", en: "Coptic heritage" },
    community: { ar: "المجتمع", en: "Community" },
    ideas: { ar: "أفكار", en: "Ideas" },
  };
  return fallbackTopicNames.map((name) => { const slug = slugify(name); return { slug, name: labels[slug] ?? { ar: name, en: name } }; });
};

function asLocalized(value: unknown, locale: Locale): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  const selected = record[locale] ?? record.en ?? record.ar;
  return typeof selected === "string" ? selected : "";
}

function localizedRecord(value: unknown, locale: Locale): Record<Locale, string> {
  const selected = asLocalized(value, locale);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return {
      ar: typeof record.ar === "string" ? record.ar : selected,
      en: typeof record.en === "string" ? record.en : selected,
    };
  }
  return { ar: selected, en: selected };
}

function extractLexicalText(node: LexicalNode | undefined): string {
  if (!node) return "";
  if (typeof node.text === "string") return node.text;
  return (node.children ?? []).map((child) => extractLexicalText(child)).join("");
}

function lexicalParagraphs(body: PayloadArticle["body"]): string[] {
  const children = body?.root?.children ?? [];
  return children.map((node) => extractLexicalText(node).trim()).filter(Boolean);
}

function mediaFromPayload(value: PayloadArticle["coverImage"] | PayloadAuthor["avatar"]): StoryMedia | undefined {
  if (!value || typeof value !== "object") return undefined;
  const media = value as PayloadMedia;
  const url = media.cloudinarySecureUrl || media.url;
  if (!url) return undefined;
  return {
    url,
    alt: media.alt || "",
    ...(media.width ? { width: media.width } : {}),
    ...(media.height ? { height: media.height } : {}),
    ...(media.caption ? { caption: media.caption } : {}),
  };
}

function displayDate(iso: string | null | undefined, locale: Locale, fallback: string): string {
  if (!iso) return fallback;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

function slugify(value: string): string {
  return value.trim().toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function artFor(article: PayloadArticle, fallback: Story | undefined, index: number): Story["art"] {
  if (fallback) return fallback.art;
  return (["archive", "terracotta", "night", "papyrus", "map"] as const)[index % 5];
}

function mapArticle(article: PayloadArticle, locale: Locale, index: number): CmsStory {
  const fallback = fallbackStories.find((story) => story.slug === article.slug);
  const category = article.category && typeof article.category === "object" ? article.category : undefined;
  const topic = article.topics?.find((item): item is PayloadTopic => typeof item === "object");
  const author = article.author && typeof article.author === "object" ? article.author : undefined;
  const title = localizedRecord(article.title, locale);
  const excerpt = localizedRecord(article.excerpt, locale);
  const paragraphs = lexicalParagraphs(article.body);
  const fallbackDate = fallback?.date[locale] ?? "";
  const date = displayDate(article.publishedAt || article.updatedAt, locale, fallbackDate);
  const authorName = localizedRecord(author?.name, locale);
  const categoryName = localizedRecord(category?.name, locale);
  const topicSlug = topic?.slug || category?.slug || fallback?.topic || "news";
  const words = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;

  return {
    id: article.id,
    slug: article.slug,
    category: categoryName,
    title: { ar: title.ar || fallback?.title.ar || "", en: title.en || fallback?.title.en || "" },
    excerpt: { ar: excerpt.ar || fallback?.excerpt.ar || "", en: excerpt.en || fallback?.excerpt.en || "" },
    body: {
      ar: locale === "ar" && paragraphs.length ? paragraphs : fallback?.body.ar || paragraphs,
      en: locale === "en" && paragraphs.length ? paragraphs : fallback?.body.en || paragraphs,
    },
    date: { ar: locale === "ar" ? date : fallback?.date.ar || date, en: locale === "en" ? date : fallback?.date.en || date },
    author: { ar: authorName.ar || fallback?.author.ar || "", en: authorName.en || fallback?.author.en || "" },
    readTime: fallback?.readTime || Math.max(1, Math.ceil(words / 180)),
    art: artFor(article, fallback, index),
    artLabel: fallback?.artLabel || `${topicSlug.toUpperCase()} / ${String(index + 1).padStart(2, "0")}`,
    featured: Boolean(article.featured),
    topic: topicSlug,
    coverImage: mediaFromPayload(article.coverImage),
    seoTitle: article.seoTitle ? localizedRecord(article.seoTitle, locale) : undefined,
    seoDescription: article.seoDescription ? localizedRecord(article.seoDescription, locale) : undefined,
    publishedAt: article.publishedAt || undefined,
    updatedAt: article.updatedAt,
    authorId: author?.id,
  };
}

async function findPublishedArticles(locale: Locale, where?: Where): Promise<PayloadArticle[]> {
  if (process.env.NEXT_PHASE === "phase-production-build" && !canQueryCmsDuringBuild) return [];
  try {
    const payload = await withCmsReadTimeout(getPayloadClient());
    const result = await withCmsReadTimeout(payload.find({
      collection: "articles",
      locale,
      fallbackLocale: "en",
      depth: 2,
      limit: 100,
      sort: "-publishedAt",
      where: { _status: { equals: "published" }, ...(where || {}) },
    }));
    return result.docs as unknown as PayloadArticle[];
  } catch (error) {
    // A local checkout can be used before a CMS database is initialized. In a
    // production server, surface the outage instead of silently serving stale
    // fixture content; the build phase remains fixture-safe for CI previews.
    if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
      throw error;
    }
    return [];
  }
}

export async function getStories(locale: Locale): Promise<CmsStory[]> {
  const docs = await findPublishedArticles(locale);
  return docs.length ? docs.map((doc, index) => mapArticle(doc, locale, index)) : fallbackStories;
}

export async function getFeaturedStories(locale: Locale): Promise<CmsStory[]> {
  const stories = await getStories(locale);
  return stories.filter((story) => story.featured);
}

export async function getStoryBySlug(locale: Locale, slug: string): Promise<CmsStory | undefined> {
  const docs = await findPublishedArticles(locale, { slug: { equals: slug } });
  if (docs.length) return mapArticle(docs[0], locale, 0);
  return fallbackStories.find((story) => story.slug === slug);
}

export async function getRelatedStories(locale: Locale, story: Story): Promise<CmsStory[]> {
  const all = await getStories(locale);
  return all.filter((item) => item.slug !== story.slug && item.topic === story.topic).slice(0, 3);
}

export async function getTopics(locale: Locale): Promise<CmsTopic[]> {
  if (process.env.NEXT_PHASE === "phase-production-build" && !canQueryCmsDuringBuild) return fallbackTopics();
  try {
    const payload = await withCmsReadTimeout(getPayloadClient());
    const result = await withCmsReadTimeout(payload.find({ collection: "topics", locale, fallbackLocale: "en", depth: 0, limit: 200, sort: "name" }));
    if (result.docs.length) {
      return (result.docs as unknown as PayloadTopic[]).map((topic) => ({ id: topic.id, slug: topic.slug, name: localizedRecord(topic.name, locale) }));
    }
  } catch (error) {
    if (shouldPropagateCmsError()) throw error;
    // See getStories: the checked-in fixture is an intentional bootstrap path.
  }
  return fallbackTopics();
}

export async function getTopicBySlug(locale: Locale, slug: string): Promise<CmsTopic | undefined> {
  const topic = (await getTopics(locale)).find((item) => item.slug === slug);
  return topic;
}

export async function getAuthors(locale: Locale): Promise<CmsAuthor[]> {
  if (process.env.NEXT_PHASE === "phase-production-build" && !canQueryCmsDuringBuild) {
    const names = [...new Set(fallbackStories.map((story) => story.author.en))];
    return names.map((name) => ({ slug: slugify(name), name: { ar: fallbackStories.find((s) => s.author.en === name)?.author.ar || name, en: name } }));
  }
  try {
    const payload = await withCmsReadTimeout(getPayloadClient());
    const result = await payload.find({ collection: "authors", locale, fallbackLocale: "en", depth: 1, limit: 200, sort: "name" });
    if (result.docs.length) {
      return (result.docs as unknown as PayloadAuthor[]).map((author) => {
        const name = localizedRecord(author.name, locale);
        return { id: author.id, slug: `author-${String(author.id)}`, name, bio: author.bio ? localizedRecord(author.bio, locale) : undefined, avatar: mediaFromPayload(author.avatar) };
      });
    }
  } catch (error) {
    if (shouldPropagateCmsError()) throw error;
    // Checked-in content remains available until the first author is created.
  }
  const names = [...new Set(fallbackStories.map((story) => story.author.en))];
  return names.map((name) => ({ slug: slugify(name), name: { ar: fallbackStories.find((s) => s.author.en === name)?.author.ar || name, en: name } }));
}

export async function getAuthorBySlug(locale: Locale, slug: string): Promise<CmsAuthor | undefined> {
  const authors = await getAuthors(locale);
  return authors.find((author) => author.slug === slug || (slug === "editorial-desk" && author.slug === "the-editorial-desk"));
}

export async function getStoriesByAuthor(locale: Locale, authorSlug: string): Promise<CmsStory[]> {
  const author = await getAuthorBySlug(locale, authorSlug);
  if (!author) return [];
  const stories = await getStories(locale);
  return stories.filter((story) => story.authorId !== undefined ? `author-${String(story.authorId)}` === author.slug : story.author.en && slugify(story.author.en) === author.slug);
}

export async function searchStories(locale: Locale, query: string): Promise<CmsStory[]> {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return [];
  return (await getStories(locale)).filter((story) => [story.title[locale], story.excerpt[locale], ...story.body[locale]].join(" ").toLocaleLowerCase().includes(needle));
}
