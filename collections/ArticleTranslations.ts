import type { CollectionConfig } from "payload";
import { isApprovedOwner } from "../lib/auth/permissions";

export const ArticleTranslations: CollectionConfig = {
  slug: "article-translations",
  admin: { useAsTitle: "title", hidden: true },
  // Article localization is currently managed through the article workflow;
  // keep this hidden collection owner-only until assignment-aware translation
  // editing is implemented.
  access: { read: ({ req }) => isApprovedOwner(req.user), create: ({ req }) => isApprovedOwner(req.user), update: ({ req }) => isApprovedOwner(req.user), delete: ({ req }) => isApprovedOwner(req.user) },
  fields: [{ name: "article", type: "relationship", relationTo: "articles", required: true }, { name: "locale", type: "select", required: true, options: [{ label: "Arabic", value: "ar" }, { label: "English", value: "en" }] }, { name: "title", type: "text", required: true }, { name: "excerpt", type: "textarea", required: true }, { name: "body", type: "richText", required: true }],
};
