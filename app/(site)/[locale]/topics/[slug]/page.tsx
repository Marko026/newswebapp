import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { ui } from "@/lib/content";
import { getStories, getTopicBySlug } from "@/lib/cms/repository";
import { requireLocale } from "@/lib/i18n";

export default async function TopicPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = requireLocale(raw);
  const topic = await getTopicBySlug(locale, slug);
  if (!topic) notFound();
  const filtered = (await getStories(locale)).filter((story) => story.topic === slug);
  return <main className="page-wrap subpage"><div className="subpage-heading"><p className="eyebrow">{ui[locale].topics}</p><span className="topic-chip">{topic.name[locale]}</span><h1>{locale === "ar" ? "قصص تحت هذا العنوان" : "Stories under this heading"}</h1></div><div className="article-list">{filtered.length ? filtered.map((story) => <ArticleCard key={story.slug} story={story} locale={locale} />) : <p>{ui[locale].noResults}</p>}</div></main>;
}
