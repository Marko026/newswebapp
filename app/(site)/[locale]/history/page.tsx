import { ArticleCard } from "@/components/article-card";
import { ui } from "@/lib/content";
import { getStories } from "@/lib/cms/repository";
import { localizedPath, requireLocale } from "@/lib/i18n";
import { EmptyState } from "@/components/empty-state";

export default async function HistoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const historyStories = (await getStories(locale)).filter((story) => story.topic === "history" || story.topic === "heritage");

  return <main className="page-wrap subpage history-index">
    <div className="subpage-heading history-heading">
      <p className="eyebrow">{ui[locale].history}</p><h1>{locale === "ar" ? "ما يبقى، وما يتغير" : "What remains, what changes"}</h1>
      <p className="subpage-lede">{locale === "ar" ? "أرشيف مفتوح يضع الأخبار في سياقها الطويل." : "An open archive that places the news in its longer context."}</p>
    </div>
    <section className="archive-intro" aria-labelledby="archive-intro-title">
      <div className="archive-copy"><p id="archive-intro-title">{locale === "ar" ? "نكتب عن التاريخ لأنه ليس خلفنا. إنه حاضر في المدن، في الأسماء، وفي الطريقة التي نرى بها المستقبل." : "We write about history because it is not behind us. It is present in cities, names, and the way we imagine the future."}</p><p>{locale === "ar" ? "هذه مساحة للقصص التي تحتاج إلى وقت أطول من دورة الأخبار." : "A collection of stories that need more time than the news cycle allows."}</p></div>
      <div className="story-art context-art art-papyrus"><span>OPEN ARCHIVE / 01</span></div>
    </section>
    {historyStories.length ? <section className="history-records" aria-labelledby="history-records-title"><div className="stream-heading"><div><p className="eyebrow">{locale === "ar" ? "سجل القصص" : "The record"}</p><h2 id="history-records-title">{locale === "ar" ? "من الأرشيف" : "From the archive"}</h2></div><span className="stream-rule" aria-hidden="true" /></div><div className="history-list">{historyStories.map((story, index) => <div className="history-entry" key={story.slug}><span className="history-entry-number">{String(index + 1).padStart(2, "0")}</span><ArticleCard story={story} locale={locale} variant="compact" /></div>)}</div></section> : <EmptyState title={locale === "ar" ? "لا توجد قصص أرشيفية بعد" : "No archive stories yet"} body={locale === "ar" ? "سيظهر السياق التاريخي هنا عند نشر أول قصة." : "Historical context will appear here when the first story is published."} href={localizedPath(locale, "/news")} action={locale === "ar" ? "اقرأ الأخبار" : "Read the news"} />}
  </main>;
}
