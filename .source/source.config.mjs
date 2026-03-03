// source.config.ts
import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";

// src/config/locales.json
var locales_default = {
  locales: [
    "tr",
    "en"
  ],
  defaultLocale: "tr"
};

// src/lib/locales.ts
var locales = locales_default.locales;
var defaultLocale = locales_default.defaultLocale;

// source.config.ts
if (locales.length === 0) {
  throw new Error("At least one locale must be defined in locales.json");
}
var localeEnum = z.enum([...locales]);
var posts = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: z.object({
    locale: localeEnum,
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    date: z.string(),
    category: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    author: z.string().default("Likya Mekanik"),
    translationKey: z.string(),
    isPillar: z.boolean().default(false),
    pillarKey: z.string().optional(),
    draft: z.boolean().default(false),
    cta: z.object({
      title: z.string().default("\xDCcretsiz Ke\u015Fif"),
      description: z.string().default("Bizimle ileti\u015Fime ge\xE7in."),
      button: z.string().default("Soru Sor"),
      whatsappMessage: z.string().default("Bilgi almak istiyorum.")
    }).optional()
  })
});
var source_config_default = defineConfig();
export {
  source_config_default as default,
  posts
};
