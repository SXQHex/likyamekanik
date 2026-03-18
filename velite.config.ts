import { defineConfig, defineCollection, s } from 'velite'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { locales } from './src/lib/locales'

const posts = defineCollection({
    name: 'Post',
    pattern: `blog/+( ${locales.join('|')} )/**/*.mdx`.replace(/\s/g, ''),
    schema: s.object({
        translationKey: s.string(),
        locale: s.enum(locales as [string, ...string[]]),
        slug: s.string(),
        metaTitle: s.string(),
        metaDescription: s.string(),
        title: s.string(),
        description: s.string(),
        date: s.isodate(),
        category: s.array(s.string()).default([]),
        tags: s.array(s.string()).default([]),
        coverImage: s.string().optional(),
        coverImageAlt: s.string().optional(),
        author: s.string().default('Likya Mekanik Tesisat'),
        isPillar: s.boolean().default(false),
        pillarKey: s.string().optional(),
        draft: s.boolean().default(false),
        cta: s
            .object({
                title: s.string().default('Ücretsiz Keşif'),
                description: s.string().default('Bizimle iletişime geçin.'),
                button: s.string().default('Soru Sor'),
                whatsappMessage: s.string().default('Bilgi almak istiyorum.'),
            })
            .optional(),
        // Velite-specific computed fields
        code: s.mdx(),
        toc: s.toc({ maxDepth: 6 }),
        metadata: s.metadata(),
    }),
})

export default defineConfig({
    root: 'content',
    output: {
        data: '.velite',
        assets: 'public/static',
    },
    collections: { posts },
    mdx: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, {
                behavior: 'wrap', // başlık metnini <a> ile sarar
            }],
            rehypeKatex,
        ],
    },
})
