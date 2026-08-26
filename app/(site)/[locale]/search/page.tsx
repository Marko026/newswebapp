import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { ui } from "@/lib/content";
import { searchStories } from "@/lib/cms/repository";
import { localizedPath, requireLocale } from "@/lib/i18n";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const locale = requireLocale((await params).locale);
  const rawQuery = (await searchParams).q;
  const q = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery ?? "").trim().slice(0, 120);
  const matches = q ? await searchStories(locale, q) : [];

  return (
    <main className="page-wrap subpage">
      <div className="subpage-heading">
        <p className="eyebrow">{ui[locale].search}</p>
        <h1>{locale === "ar" ? "ابحث في الأرشيف" : "Search the archive"}</h1>
        <form className="search-form">
          <input name="q" defaultValue={q} placeholder={locale === "ar" ? "اكتب كلمة أو موضوعاً" : "Search a word or topic"} aria-label={ui[locale].search} />
          <button type="submit">⌕</button>
        </form>
      </div>
      {q ? (
        <div className="article-list">
          {matches.length ? matches.map((story) => <ArticleCard story={story} locale={locale} key={story.slug} />) : <p>{ui[locale].noResults}</p>}
        </div>
      ) : (
        <div className="search-hint">
          <p className="eyebrow">{locale === "ar" ? "اقتراح" : "Try"}</p>
          <Link href={localizedPath(locale, "/topics/history")}>{locale === "ar" ? "التاريخ" : "History"}</Link> · <Link href={localizedPath(locale, "/topics/egypt")}>{locale === "ar" ? "مصر" : "Egypt"}</Link>
        </div>
      )}
    </main>
  );
}
