import { ArticleCard } from "@/components/article-card";
import { ui } from "@/lib/content";
import { getStories } from "@/lib/cms/repository";
import { localizedPath, requireLocale } from "@/lib/i18n";
import { EmptyState } from "@/components/empty-state";

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const stories = await getStories(locale);
  const lead = stories[0];
  const supporting = stories.slice(1);

  return <main className="page-wrap subpage news-index">
    <div className="subpage-heading news-heading">
      <div className="news-heading-top"><p className="eyebrow">{ui[locale].allNews}</p><span className="page-index">{String(stories.length).padStart(2, "0")} {locale === "ar" ? "قصص" : "stories"}</span></div>
      <h1>{locale === "ar" ? "كل ما نعرفه الآن" : "Everything we know now"}</h1>
      <p className="subpage-lede">{locale === "ar" ? "أخبار وتحقيقات وسياق من هيئة تحرير مستقلة." : "Reporting, investigation, and context from an independent editorial desk."}</p>
    </div>
    {stories.length ? <>
      <section className="news-lead-section" aria-label={locale === "ar" ? "القصة الرئيسية" : "Lead story"}>
        <div className="news-lead-card"><ArticleCard story={lead} locale={locale} variant="wide" /></div>
      </section>
      {supporting.length ? <section className="news-stream" aria-labelledby="news-stream-title">
        <div className="stream-heading"><div><p className="eyebrow">{locale === "ar" ? "آخر التحديثات" : "The latest"}</p><h2 id="news-stream-title">{locale === "ar" ? "قصص أخرى تستحق القراءة" : "More to read"}</h2></div><span className="stream-rule" aria-hidden="true" /></div>
        <div className="article-list news-list">{supporting.map((story) => <ArticleCard key={story.slug} story={story} locale={locale} />)}</div>
      </section> : null}
    </> : <EmptyState title={locale === "ar" ? "لا توجد قصص منشورة بعد" : "No stories are published yet"} body={locale === "ar" ? "ستظهر القصص هنا عندما تنشرها هيئة التحرير." : "Stories will appear here when the editorial desk publishes them."} href={localizedPath(locale, "/topics")} action={locale === "ar" ? "استكشف الموضوعات" : "Explore topics"} />}
  </main>;
}
