import { posts } from '../../.source/server';
import { type TOCItemType } from "fumadocs-core/toc";
import { localizedStaticSections } from './routes'; // Merkezi rotaları içeri al
import { type Locale } from './locales';

// 1. Tip Güvenliğini Kaynaktan Türet
export type BlogPost = (typeof posts)[number];

export interface BlogTreeNode {
  title: string;
  url: string;
  children?: BlogTreeNode[];
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

// TOC Helper
export function convertToTOCItemType(toc?: TocItem[]): TOCItemType[] {
  if (!toc) return [];
  return toc.map(item => ({
    id: item.id,
    title: item.title,
    url: `#${item.id}`,
    depth: item.level,
  }));
}

export const buildPostUrl = (p: BlogPost) => {
  const section = localizedStaticSections.blog[p.locale] ?? "blog";
  return `/${section}/${p.slug}`;
};

export async function getAllPosts(locale: Locale): Promise<BlogPost[]> {
  return (posts as BlogPost[]).filter(
    (p) => p.locale === locale && !p.draft
  );
}

export async function getPostBySlug(
  locale: Locale,
  slug: string
): Promise<BlogPost | null> {
  return (
    (posts as BlogPost[]).find(
      (p) => p.locale === locale && p.slug === slug
    ) ?? null
  );
}

export function getPostTranslations(
  translationKey: string,
  currentLocale: Locale
) {
  return (posts as BlogPost[])
    .filter(
      (p) =>
        p.translationKey === translationKey &&
        p.locale !== currentLocale
    )
    .map((p) => ({
      locale: p.locale,
      slug: p.slug,
      url: buildPostUrl(p),
    }));
}

export function getAllPostParams() {
  return (posts as BlogPost[])
    .filter((p) => !p.draft)
    .map((p) => ({
      locale: p.locale,
      slug: p.slug,
    }));
}

export function getClusterPosts(pillarKey: string, locale: Locale): BlogPost[] {
  return (posts as BlogPost[]).filter(
    (p) => p.locale === locale && p.pillarKey === pillarKey && !p.isPillar
  );
}

export function getPillarPost(pillarKey: string, locale: string): BlogPost | null {
  return (posts as BlogPost[]).find(
    (p) => p.locale === locale && p.isPillar && p.translationKey === pillarKey
  ) ?? null;
}

export function getPostTree(locale: Locale, currentPost: BlogPost): BlogTreeNode | null {
  const category = currentPost.category?.[0];
  if (!category) return null;

  const categoryPosts = (posts as BlogPost[]).filter(
    (p) => p.locale === locale && p.category?.[0] === category && !p.draft
  );

  return {
    title: category,
    url: `/${locale}/blog?category=${encodeURIComponent(category)}`,
    children: categoryPosts.map((p) => ({
      title: p.title,
      url: buildPostUrl(p),
    })),
  };
}

// Alias'lar
export const getPost = getPostBySlug;
export const getPostsByLocale = getAllPosts;