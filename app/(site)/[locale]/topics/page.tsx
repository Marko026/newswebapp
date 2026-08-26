import Link from "next/link";
import { ui } from "@/lib/content";
import { getTopics } from "@/lib/cms/repository";
import { localizedPath, requireLocale } from "@/lib/i18n";

export default async function TopicsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const topics = await getTopics(locale);
  return <main className="page-wrap subpage"><div className="subpage-heading"><p className="eyebrow">{ui[locale].topics}</p><h1>{locale === "ar" ? "مسارات القراءة" : "Ways into the archive"}</h1></div><div className="topic-list topic-detail">{topics.map((topic, index) => <Link key={topic.slug} href={localizedPath(locale, `/topics/${topic.slug}`)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{topic.name[locale]}</strong><span>↗</span></Link>)}</div></main>;
}
