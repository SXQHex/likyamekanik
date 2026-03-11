import { posts, type Post } from '#content';
import { type Locale } from './locales';
import { type Href } from './navigation';

// 1. Tip Güvenliğini Kaynaktan Türet
export type BlogPost = Post;

export interface BlogTreeNode {
  title: string;
  url: Href;
  children?: BlogTreeNode[];
}

// Velite TocEntry tipi
export interface TocEntry {
  title: string;
  url: string; // Internal fragment usually, but let's keep it safe. 
  items: TocEntry[];
}

export const buildPostUrl = (p: BlogPost) => {
  return {
    pathname: '/blog/[slug]' as const,
    params: { slug: p.slug }
  };
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

  // 1. Yazının ait olduğu hiyerarşinin en tepesindeki Pillar'ı bul
  const findRootPillar = (post: BlogPost): BlogPost | null => {
    if (!post.pillarKey) return post.isPillar ? post : null;
    const parent = posts.find(p => p.locale === locale && p.isPillar && p.translationKey === post.pillarKey);
    return parent ? findRootPillar(parent) : (post.isPillar ? post : null);
  };

  const rootPillar = findRootPillar(currentPost);

  // 2. Rekürsif ağaç oluşturucu
  const buildDeepTree = (parentPillarKey: string): BlogTreeNode[] => {
    return posts
      .filter(p => p.locale === locale && p.pillarKey === parentPillarKey && !p.draft)
      .map(p => ({
        title: p.title,
        url: buildPostUrl(p),
        children: p.isPillar ? buildDeepTree(p.translationKey) : []
      }));
  };

  // 3. Ağacı Kategori köküyle oluştur
  const tree: BlogTreeNode = {
    title: category,
    url: { pathname: '/blog' as const, query: { category } },
    children: []
  };

  // 4. Çocukları ekle (Eğer Pillar içindeyse, o Pillar'ı ve hiyerarşisini ekle)
  if (rootPillar) {
    tree.children = [
      {
        title: rootPillar.title,
        url: buildPostUrl(rootPillar),
        children: buildDeepTree(rootPillar.translationKey)
      }
    ];
    // Opsiyonel: Kategorideki diğer standalone yazıları da ekleyebiliriz
    const otherPosts = posts.filter(p =>
      p.locale === locale &&
      p.category?.[0] === category &&
      !p.draft &&
      !p.pillarKey &&
      !p.isPillar &&
      p.slug !== rootPillar.slug
    );
    tree.children.push(...otherPosts.map(p => ({ title: p.title, url: buildPostUrl(p) })));
  } else {
    // Pillar hiyerarşisi yoksa tüm kategori yazılarını göster
    tree.children = posts
      .filter(p => p.locale === locale && p.category?.[0] === category && !p.draft)
      .map(p => ({
        title: p.title,
        url: buildPostUrl(p),
        children: p.isPillar ? buildDeepTree(p.translationKey) : []
      }));
  }

  return tree;
}

export function getBreadcrumbSegments(locale: Locale, currentPost: BlogPost) {
  const segments: { title: string; url: Href }[] = [];

  // 1. Kategori
  const category = currentPost.category?.[0];
  if (category) {
    segments.push({
      title: category,
      url: { pathname: '/blog' as const, query: { category } },
    });
  }

  // 2. Pillar Zinciri (Rekürsif yukarı doğru)
  const resolvePillars = (post: BlogPost) => {
    if (!post.pillarKey) return;
    const pillar = posts.find(
      (p) => p.locale === locale && p.isPillar && p.translationKey === post.pillarKey
    );
    if (pillar) {
      resolvePillars(pillar);
      segments.push({
        title: pillar.title,
        url: buildPostUrl(pillar),
      });
    }
  };

  resolvePillars(currentPost);

  // 3. Mevcut Yazı
  segments.push({
    title: currentPost.title,
    url: buildPostUrl(currentPost),
  });

  return segments;
}

// Alias'lar
export const getPost = getPostBySlug;
export const getPostsByLocale = getAllPosts;