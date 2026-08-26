import Link from "next/link";
import { FeaturedCarousel } from "@/components/featured-carousel";
import { ArticleCard } from "@/components/article-card";
import { ui } from "@/lib/content";
import { getStories, getTopics } from "@/lib/cms/repository";
import { localizedPath, requireLocale } from "@/lib/i18n";

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const t = ui[locale];
  const [stories, cmsTopics] = await Promise.all([getStories(locale), getTopics(locale)]);
  const featured = stories.filter((story) => story.featured);
  const latest = stories.filter((story) => !story.featured);
  return <main>
    <section className="breaking-bar page-wrap"><span className="breaking-dot" /> <strong>{locale === "ar" ? "الآن" : "Now"}</strong><span>{locale === "ar" ? "نقرأ الحاضر من خلال التاريخ" : "Reading the present through history"}</span></section>
    <div className="page-wrap home-intro"><p className="eyebrow">{locale === "ar" ? "منصة مستقلة" : "Independent platform"}</p><p>{locale === "ar" ? "أخبار، تاريخ، وذاكرة من مصر والعالم." : "News, history, and memory from Egypt and the world."}</p></div>
    <section className="page-wrap feature-wrap"><FeaturedCarousel stories={featured.length ? [...featured, ...stories.filter((story) => !story.featured)].slice(0, 3) : stories.slice(0, 3)} locale={locale} /></section>
    <section className="page-wrap latest-section"><div className="section-header"><div><p className="eyebrow">{t.latest}</p><h2>{locale === "ar" ? "ما يحدث الآن" : "What is happening now"}</h2></div><Link className="line-link" href={localizedPath(locale, "/news")}>{t.viewAll} ↗</Link></div><div className="latest-grid">{latest.map((story) => <ArticleCard story={story} locale={locale} key={story.slug} />)}</div></section>
    <section className="context-section page-wrap"><div className="context-copy"><p className="eyebrow">{t.history}</p><h2>{t.aboutTitle}</h2><p>{t.aboutText}</p><Link className="button-link button-outline" href={localizedPath(locale, "/history")}>{t.viewAll}<span>↗</span></Link></div><div className="context-art art-map"><span>FIELD NOTE / 07</span></div></section>
    <section className="page-wrap topic-index"><div className="section-header"><div><p className="eyebrow">{t.topics}</p><h2>{locale === "ar" ? "مسارات القراءة" : "Ways into the archive"}</h2></div></div><div className="topic-list">{cmsTopics.map((topic, index) => <Link key={topic.slug} href={localizedPath(locale, `/topics/${topic.slug}`)}><span>0{index + 1}</span><strong>{topic.name[locale]}</strong><span>↗</span></Link>)}</div></section>
    <section className="editorial-note page-wrap"><div><p className="eyebrow">{t.editorial}</p><p className="note-quote">“{locale === "ar" ? "لا نطارد كل خبر. نبحث عن السياق الذي يجعل الخبر مفهوماً." : "We do not chase every story. We look for the context that makes it legible."}”</p></div><div className="note-signature">{locale === "ar" ? "هيئة التحرير" : "The editorial desk"}<br /><span>{locale === "ar" ? "القاهرة" : "Cairo"}</span></div></section>
    <section className="newsletter-block page-wrap"><div><p className="eyebrow">{t.newsletter}</p><h2>{locale === "ar" ? "رسالة واحدة. قصص تستحق وقتك." : "One letter. Stories worth your time."}</h2></div><Link className="button-link button-filled" href={localizedPath(locale, "/newsletter")}>{t.subscribe}<span>↗</span></Link></section>
  </main>;
}
