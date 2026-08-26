import { ArticleCard } from "@/components/article-card";
import { ui } from "@/lib/content";
import { getStories } from "@/lib/cms/repository";
import { requireLocale } from "@/lib/i18n";

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) { const locale = requireLocale((await params).locale); const stories = await getStories(locale); return <main className="page-wrap subpage"><div className="subpage-heading"><p className="eyebrow">{ui[locale].allNews}</p><h1>{locale === "ar" ? "كل ما نعرفه الآن" : "Everything we know now"}</h1><p className="subpage-lede">{locale === "ar" ? "أخبار وتحقيقات وسياق من هيئة تحرير مستقلة." : "Reporting, investigation, and context from an independent editorial desk."}</p></div><div className="article-list">{stories.map((story) => <ArticleCard key={story.slug} story={story} locale={locale} />)}</div></main>; }
