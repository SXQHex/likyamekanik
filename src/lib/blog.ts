import { posts, type Post } from '#content';
import { localizedStaticSections } from './routes';
import { type Locale } from './locales';

// 1. Tip Güvenliğini Kaynaktan Türet
export type BlogPost = Post;

export interface BlogTreeNode {
  title: string;
  url: string;
  children?: BlogTreeNode[];
}

// Velite TocEntry tipi
export interface TocEntry {
  title: string;
  url: string;
  items: TocEntry[];
}

export const buildPostUrl = (p: BlogPost) => {
  const section = localizedStaticSections.blog[p.locale] ?? "blog";
  return `/${section}/${p.slug}`;
};

export async function getAllPosts(locale: Locale): Promise<BlogPost[]> {
  return posts.filter(
    (p) => p.locale === locale && !p.draft
  );
}

export async function getPostBySlug(
  locale: Locale,
  slug: string
): Promise<BlogPost | null> {
  return (
    posts.find(
      (p) => p.locale === locale && p.slug === slug
    ) ?? null
  );
}

export function getPostTranslations(
  translationKey: string,
  currentLocale: Locale
) {
  return posts
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
  return posts
    .filter((p) => !p.draft)
    .map((p) => ({
      locale: p.locale,
      slug: p.slug,
    }));
}

export function getClusterPosts(pillarKey: string, locale: Locale): BlogPost[] {
  return posts.filter(
    (p) => p.locale === locale && p.pillarKey === pillarKey && !p.isPillar
  );
}

export function getPillarPost(pillarKey: string, locale: string): BlogPost | null {
  return posts.find(
    (p) => p.locale === locale && p.isPillar && p.translationKey === pillarKey
  ) ?? null;
}

export function getPostTree(locale: Locale, currentPost: BlogPost): BlogTreeNode | null {
  const category = currentPost.category?.[0];
  if (!category) return null;

  const categoryPosts = posts.filter(
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