// source.config.ts
import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";
import { locales } from "@/lib/locales";

if (locales.length === 0) {
  throw new Error("At least one locale must be defined in locales.json");
}
const localeEnum = z.enum([...locales] as [string, ...string[]]);

export const posts = defineCollections({
  type: 'doc',
  dir: 'content/blog',
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
      title: z.string().default("Ücretsiz Keşif"),
      description: z.string().default("Bizimle iletişime geçin."),
      button: z.string().default("Soru Sor"),
      whatsappMessage: z.string().default("Bilgi almak istiyorum."),
    }).optional(),
  }),
});

export type PostData = z.infer<typeof posts>;

export default defineConfig();