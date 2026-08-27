import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { ui } from "@/lib/content";
import { getStories, getTopicBySlug } from "@/lib/cms/repository";
import { localizedPath, requireLocale } from "@/lib/i18n";
import { EmptyState } from "@/components/empty-state";

export default async function TopicPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = requireLocale(raw);
  const topic = await getTopicBySlug(locale, slug);
  if (!topic) notFound();
  const filtered = (await getStories(locale)).filter((story) => story.topic === slug);
  return <main className="page-wrap subpage"><div className="subpage-heading"><p className="eyebrow">{ui[locale].topics}</p><span className="topic-chip">{topic.name[locale]}</span><h1>{locale === "ar" ? "قصص تحت هذا العنوان" : "Stories under this heading"}</h1></div>{filtered.length ? <div className="article-list">{filtered.map((story) => <ArticleCard key={story.slug} story={story} locale={locale} />)}</div> : <EmptyState title={locale === "ar" ? "لا توجد قصص في هذا المسار بعد" : "No stories in this path yet"} body={locale === "ar" ? "جرّب مساراً آخر من الأرشيف." : "Try another path through the archive."} href={localizedPath(locale, "/topics")} action={locale === "ar" ? "كل الموضوعات" : "All topics"} />}</main>;
}
