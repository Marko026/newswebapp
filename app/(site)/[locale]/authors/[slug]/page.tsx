import { ArticleCard } from "@/components/article-card";
import { ui } from "@/lib/content";
import { getAuthorBySlug, getAuthors, getStoriesByAuthor } from "@/lib/cms/repository";
import { requireLocale } from "@/lib/i18n";
import { EmptyState } from "@/components/empty-state";
import { notFound } from "next/navigation";

export async function generateStaticParams() { const params: { locale: string; slug: string }[] = []; for (const locale of ["ar", "en"] as const) for (const author of await getAuthors(locale)) params.push({ locale, slug: author.slug }); return params; }
export default async function AuthorPage({ params }: { params: Promise<{ locale: string; slug: string }> }) { const { locale: raw, slug } = await params; const locale = requireLocale(raw); const author = await getAuthorBySlug(locale, slug); if (!author) notFound(); const authored = await getStoriesByAuthor(locale, slug); return <main className="page-wrap subpage"><div className="subpage-heading"><p className="eyebrow">{ui[locale].author}</p><h1>{author.name[locale]}</h1><p className="subpage-lede">{author.bio?.[locale] || (locale === "ar" ? "مساحة مشتركة للقصص التي تحتاج إلى سياق." : "A shared desk for stories that need context.")}</p></div>{authored.length ? <div className="article-list">{authored.map((story) => <ArticleCard key={story.slug} story={story} locale={locale} />)}</div> : <EmptyState title={locale === "ar" ? "لا توجد قصص لهذا الكاتب بعد" : "No stories from this author yet"} body={locale === "ar" ? "ستظهر القصص هنا عند نشرها." : "Stories will appear here when they are published."} />}</main>; }
