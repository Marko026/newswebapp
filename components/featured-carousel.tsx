"use client";

import { InteractiveButtonLink } from "@/components/interactive-button-link";
import { useEffect, useRef, useState } from "react";
import { localizedPath, type Locale } from "@/lib/i18n";
import type { Story } from "@/lib/content";
import { CloudinaryImage } from "@/components/cloudinary-image";

export function FeaturedCarousel({ stories, locale }: { stories: Story[]; locale: Locale }) {
  const [active, setActive] = useState(0);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dragging, setDragging] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const isPlaying = !pausedByUser && !hovered && !focused && !reducedMotion;
  const labels = locale === "ar"
    ? { previous: "السابق", next: "التالي", pause: "إيقاف العرض", play: "تشغيل العرض", slide: "شريحة", choose: "اختيار القصة" }
    : { previous: "Previous story", next: "Next story", pause: "Pause carousel", play: "Play carousel", slide: "Story", choose: "Choose story" };

  useEffect(() => {
    if (!isPlaying) return;
    interval.current = setInterval(() => setActive((value) => (value + 1) % stories.length), 7000);
    return () => { if (interval.current) clearInterval(interval.current); };
  }, [isPlaying, stories.length]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  function move(direction: number) {
    setPausedByUser(true);
    setActive((value) => (value + direction + stories.length) % stories.length);
  }

  function selectStory(index: number) {
    setPausedByUser(true);
    setActive(index);
  }

  function togglePlayback() {
    setPausedByUser((value) => !value);
  }

  function handlePickerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight") { event.preventDefault(); selectStory(locale === "ar" ? (index - 1 + stories.length) % stories.length : (index + 1) % stories.length); }
    if (event.key === "ArrowLeft") { event.preventDefault(); selectStory(locale === "ar" ? (index + 1) % stories.length : (index - 1 + stories.length) % stories.length); }
    if (event.key === "Home") { event.preventDefault(); selectStory(0); }
    if (event.key === "End") { event.preventDefault(); selectStory(stories.length - 1); }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") { event.preventDefault(); move(locale === "ar" ? -1 : 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(locale === "ar" ? 1 : -1); }
    if (event.key === "Home") { event.preventDefault(); setPausedByUser(true); setActive(0); }
    if (event.key === "End") { event.preventDefault(); setPausedByUser(true); setActive(stories.length - 1); }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragStart.current = { x: event.clientX, y: event.clientY };
    suppressClick.current = false;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragStart.current) return;
    const distanceX = event.clientX - dragStart.current.x;
    const distanceY = event.clientY - dragStart.current.y;
    if (Math.abs(distanceX) < 8 || Math.abs(distanceX) < Math.abs(distanceY)) return;
    suppressClick.current = true;
    setDragging(true);
    event.preventDefault();
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragStart.current) return;
    const distanceX = event.clientX - dragStart.current.x;
    const distanceY = event.clientY - dragStart.current.y;
    dragStart.current = null;
    setDragging(false);
    if (Math.abs(distanceX) >= 50 && Math.abs(distanceX) > Math.abs(distanceY)) {
      const forward = locale === "ar" ? distanceX > 0 : distanceX < 0;
      move(forward ? 1 : -1);
    }
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }

  function handleClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!suppressClick.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick.current = false;
  }

  return <section className="featured-carousel" role="region" aria-roledescription="carousel" aria-label={locale === "ar" ? "الأخبار المختارة" : "Featured stories"} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false); }}>
    <div className="featured-lead">
      <div>
        <p className="eyebrow">{locale === "ar" ? "الصفحة الأولى" : "The front page"}</p>
        <h2>{locale === "ar" ? "قصص تستحق أن تُقرأ ببطء" : "Stories worth reading slowly"}</h2>
      </div>
      <p className="featured-lead-note">{locale === "ar" ? "أخبار وسياق وذاكرة من مصر والعالم." : "News, context, and memory from Egypt and the world."}</p>
    </div>
    <div className={`carousel-slides${dragging ? " is-dragging" : ""}`} aria-live={isPlaying ? "off" : "polite"} tabIndex={0} onKeyDown={handleKeyDown} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} onClickCapture={handleClickCapture}>
      {stories.map((story, index) => <article key={story.slug} id={`featured-slide-${index}`} className={`carousel-slide ${index === active ? "is-active" : ""}`} role="group" aria-hidden={index !== active} aria-roledescription="slide" aria-label={`${labels.slide} ${index + 1} of ${stories.length}`}>
        <div className={`story-art hero-art art-${story.art}`}>{story.coverImage ? <CloudinaryImage className="story-art-media" src={story.coverImage.url} alt={story.coverImage.alt || story.title[locale]} width={story.coverImage.width || 1800} height={story.coverImage.height || 1200} sizes="(max-width: 720px) 100vw, 55vw" fetchPriority={index === 0 ? "high" : "auto"} loading={index === 0 ? "eager" : "lazy"} /> : <span>{story.artLabel}</span>}<span className="hero-index">0{index + 1} / 0{stories.length}</span></div>
        <div className="hero-copy">
          <div className="hero-copy-main">
            <div className="hero-copy-meta"><p className="eyebrow">{story.category[locale]}</p><span>{locale === "ar" ? "مختار" : "Featured"}</span></div>
            <h1>{story.title[locale]}</h1>
            <p>{story.excerpt[locale]}</p>
            <InteractiveButtonLink tabIndex={index === active ? 0 : -1} href={localizedPath(locale, `/news/${story.slug}`)}>{locale === "ar" ? "اقرأ القصة" : "Read the story"}</InteractiveButtonLink>
          </div>
          {index === active && <div className="hero-navigation" aria-label={labels.choose}>
            <div className="hero-progress" role="group" aria-label={labels.choose}>
              {stories.map((item, itemIndex) => <button key={item.slug} type="button" className={`hero-progress-step${itemIndex === active ? " is-active" : ""}`} aria-pressed={itemIndex === active} aria-label={`${labels.slide} ${itemIndex + 1}`} onPointerDown={(event) => event.stopPropagation()} onClick={() => selectStory(itemIndex)} onKeyDown={(event) => handlePickerKeyDown(event, itemIndex)} />)}
              <span className="hero-count">0{active + 1} / 0{stories.length}</span>
            </div>
            <div className="hero-navigation-actions">
              <button className="story-nav-button" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => move(locale === "ar" ? 1 : -1)} aria-label={labels.previous}>←</button>
              <button className="story-nav-button" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => move(locale === "ar" ? -1 : 1)} aria-label={labels.next}>→</button>
              <button className="story-nav-button story-nav-pause" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={togglePlayback} aria-pressed={pausedByUser} aria-label={pausedByUser ? labels.play : labels.pause}>{pausedByUser ? "▶" : "Ⅱ"}</button>
            </div>
          </div>}
        </div>
      </article>)}
    </div>
  </section>;
}
