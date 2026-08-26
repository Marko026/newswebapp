import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";
import type { Story } from "@/lib/content";
import { CloudinaryImage } from "@/components/cloudinary-image";

export function ArticleCard({ story, locale, variant = "standard" }: { story: Story; locale: Locale; variant?: "standard" | "compact" | "wide" }) {
  return <article className={`article-card article-card-${variant}`}><Link href={localizedPath(locale, `/news/${story.slug}`)} className={`story-art art-${story.art}`} aria-label={story.title[locale]}>{story.coverImage ? <CloudinaryImage className="story-art-media" src={story.coverImage.url} alt={story.coverImage.alt || story.title[locale]} width={story.coverImage.width || 900} height={story.coverImage.height || 650} sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" /> : <span>{story.artLabel}</span>}</Link><div className="article-card-body"><p className="eyebrow">{story.category[locale]}</p><h3><Link href={localizedPath(locale, `/news/${story.slug}`)}>{story.title[locale]}</Link></h3><p className="card-excerpt">{story.excerpt[locale]}</p><div className="story-meta"><span>{story.date[locale]}</span><span>{story.readTime} min</span></div></div></article>;
}
