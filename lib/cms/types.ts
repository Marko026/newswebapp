import type { Locale } from "@/lib/i18n";
import type { Story, StoryMedia } from "@/lib/content";

export type CmsStory = Story & {
  /** The Payload document id. Useful for cache tags and editorial tooling. */
  id?: number | string;
  /** ISO timestamp from Payload, kept separate from the localized display date. */
  publishedAt?: string;
  updatedAt?: string;
  authorId?: number | string;
};

export type CmsTopic = {
  id?: number | string;
  slug: string;
  name: Record<Locale, string>;
};

export type CmsAuthor = {
  id?: number | string;
  slug: string;
  name: Record<Locale, string>;
  bio?: Record<Locale, string>;
  avatar?: StoryMedia;
};
