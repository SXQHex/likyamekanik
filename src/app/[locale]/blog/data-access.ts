// src/app/[locale]/blog/data-access.ts

import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { cache } from 'react';
import rawManifest from './posts-manifest.json'; // 🚀 Manifesti en tepede içeri al

const postsManifest = rawManifest as BlogManifest;
// Tip tanımın aynı kalabilir

interface ManifestEntry {
    slug: string;
    originSlug: string;
    path: string;
    title: string;
    category: string;
    slugs: Record<string, string>;
}
interface BlogManifest {
    [locale: string]: ManifestEntry[] | undefined;
}

export interface BlogPost {
    slug: string;
    originSlug: string;
    slugs: Record<string, string>;
    title: string;
    category: string;
    date: string;
    excerpt: string;
    image: string;
    content: string;
    readingTime: string;
}

/**
 * ARTIK DİZİN TARAMASINA SON!
 * Manifest zaten hangi dilde hangi post var biliyor.
 */
export const getAllPosts = cache(async (lang: string, readingTimeLabel: string = "dk okuma"): Promise<BlogPost[]> => {
    // 1. Manifestten sadece ilgili dildeki yazıları filtrele
    const langPosts = postsManifest[lang] || [];

    const posts = await Promise.all(
        langPosts.map(async (entry: ManifestEntry) => {
            // entry.path zaten manifest içinde tam yol olarak var!
            const fullPath = path.join(process.cwd(), entry.path);
            const fileContents = await fs.readFile(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                ...data,
                slug: entry.slug,
                originSlug: entry.originSlug,
                slugs: entry.slugs, // Manifest bu haritayı zaten build öncesi çıkardı!
                content,
                readingTime: calculateReadingTime(content, readingTimeLabel),
            } as BlogPost;
        })
    );

    return posts.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
});

/**
 * TEKİL YAZI GETİRİCİ: Işık hızında nokta atışı
 */
export const getPostBySlug = cache(async (lang: string, slug: string, readingTimeLabel: string = "dk okuma"): Promise<BlogPost | null> => {
    // 1. Önce o dile ait listeyi güvenli bir şekilde alalım
    const langPosts = postsManifest[lang];

    // Evham Kontrolü 1: Liste hiç yoksa (undefined ise) hemen çık
    if (!langPosts) return null;

    // 2. Şimdi bu liste içinde slug'ı arayalım
    // Not: ManifestEntry tipini yukarıda tanımladığını varsayıyorum
    const entry = langPosts.find((p: ManifestEntry) => p.slug === slug);

    // Evham Kontrolü 2: Yazı bulunamadıysa çık
    if (!entry) return null;

    try {
        // Göreceli yolu tam yola çevir
        const fullPath = path.join(process.cwd(), entry.path);
        const fileContents = await fs.readFile(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            ...data,
            slug: entry.slug,
            originSlug: entry.originSlug,
            slugs: entry.slugs,
            content,
            readingTime: calculateReadingTime(content, readingTimeLabel),
        } as BlogPost;
    } catch (error) {
        console.error(`Dosya okuma hatası: ${slug}`, error);
        return null;
    }
});

// Yardımcı fonksiyonun aynı kalabilir
function calculateReadingTime(text: string, readingTimeLabel: string): string {
    const wordsPerMinute = 225;
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} ${readingTimeLabel}`;
}

/** Simple markdown → HTML converter for blog content */
export function markdownToHtml(md: string): string {
    return md
        .split("\n\n")
        .map((block) => {
            const trimmed = block.trim();
            if (!trimmed) return "";
            if (trimmed.startsWith("### "))
                return `<h3 class="text-xl font-semibold mt-6 mb-3 text-foreground">${trimmed.slice(4)}</h3>`;
            if (trimmed.startsWith("## "))
                return `<h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">${trimmed.slice(3)}</h2>`;
            if (trimmed.startsWith("- ")) {
                const items = trimmed
                    .split("\n")
                    .map((l) => `<li class="ml-4">${l.replace(/^-\s*/, "")}</li>`)
                    .join("");
                return `<ul class="list-disc list-inside space-y-1 text-muted-foreground">${items}</ul>`;
            }
            return `<p class="text-muted-foreground leading-relaxed">${trimmed}</p>`;
        })
        .join("\n");
}