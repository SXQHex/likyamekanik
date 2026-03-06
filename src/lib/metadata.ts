// src/lib/metadata.ts
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from './locales';
import { services } from './services';
import { pathnames } from './navigation';

export const DEFAULT_BASE = "https://likyamekanik.com";
export const siteName = "Likya Mekanik Tesisat";

export const ogLocales: Record<Locale, string> = {
  en: 'en_US', tr: 'tr_TR', ru: 'ru_RU', uk: 'uk_UA',
};

export function toOgImageUrl(baseUrl: string, imagePath: string, title: string, eyebrow: string): string {
  const image = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}/api/og?${new URLSearchParams({ title, eyebrow, image })}`;
}

// ─── Shared Types ────────────────────────────────────────────────────────────

export type PageParams = Promise<{ locale: Locale; slug?: string }>;

export interface MetadataOptions {
  params: PageParams;
  title: string;
  description: string;
  section: string;
  localizedSections?: Record<Locale, string>;
  keywords?: string[];
  ogImage?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  alternates?: Array<{ locale: Locale; slug: string }>;
  category?: string;
}

// ─── Core Builder ────────────────────────────────────────────────────────────

function makeUrl(base: string, locale: Locale, section: string, slug?: string): string {
  const s = section.startsWith('/') ? section.slice(1) : section;
  return [base, locale, s, slug].filter(Boolean).join('/');
}

function toISOSafe(date?: string): string | undefined {
  if (!date) return undefined;
  try { const d = new Date(date); return isNaN(d.getTime()) ? undefined : d.toISOString(); }
  catch { return undefined; }
}

export async function generatePageMetadata({
  params, title, description, section, localizedSections,
  keywords, ogImage, type = 'website', publishedTime, alternates, category = 'Engineering & Construction',
}: MetadataOptions): Promise<Metadata> {
  const { locale, slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? DEFAULT_BASE;

  const alternatesMap = Object.fromEntries(
    (alternates ?? [])
      .filter(a => a?.locale && locales.includes(a.locale))
      .map(a => [a.locale, a.slug])
  ) as Partial<Record<Locale, string>>;

  const languages = Object.fromEntries([
    ...locales.map(l => [l, makeUrl(baseUrl, l, localizedSections?.[l] ?? section, alternatesMap[l] ?? slug)]),
    ['x-default', makeUrl(baseUrl, defaultLocale, localizedSections?.[defaultLocale] ?? section, alternatesMap[defaultLocale] ?? slug)],
  ]);

  const canonical = languages[locale] ?? makeUrl(baseUrl, locale, section, slug);
  const finalImage = ogImage ?? `${baseUrl}/api/og?${new URLSearchParams({ title })}`;

  return {
    title: { default: title, template: `%s | ${siteName}` },
    description,
    keywords: keywords ?? ['mekanik tesisat', 'iklimlendirme', 'muhendislik', 'fethiye'],
    authors: [{ name: siteName, url: baseUrl }],
    metadataBase: new URL(baseUrl),
    applicationName: siteName,
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    alternates: { canonical, languages },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: canonical,
      siteName,
      locale: ogLocales[locale] ?? 'en_US',
      type,
      publishedTime: type === 'article' ? toISOSafe(publishedTime) : undefined,
      images: [{ url: finalImage, width: 1200, height: 630, alt: `${title} - ${siteName}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteName}`,
      description,
      images: [finalImage],
      creator: '@likyamekanik',
    },
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    appleWebApp: { capable: true, statusBarStyle: 'default', title },
    formatDetection: { telephone: true, address: true, email: true, date: false },
    verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION },
    category,
    icons: { icon: '/favicon.ico', shortcut: '/favicon-16x16.png', apple: '/apple-touch-icon.png' },
    manifest: `${baseUrl}/manifest.json`,
  };
}

// ─── Page-level Helpers ───────────────────────────────────────────────────────

export async function getPageMetadata({
  params, section, namespace, ogImage,
}: {
  params: PageParams;
  section: keyof typeof pathnames;
  namespace?: string;
  ogImage?: string;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: namespace ?? section });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? DEFAULT_BASE;
  const localizedSections = pathnames[section];
  const localizedSection = typeof localizedSections === 'string'
    ? localizedSections
    : (localizedSections as Record<Locale, string>)[locale] ?? section;

  // Use the provided ogImage or a default site image so dynamic text always has a background
  const finalOgImage = ogImage || '/hero/mechanical-services-1.avif';

  // Use translation for 'eyebrow' if it exists, otherwise provide a fallback
  const eyebrowText = t.has('eyebrow') ? t('eyebrow') : 'Likya Mekanik Tesisat';

  return generatePageMetadata({
    params,
    title: t('title'),
    description: t('description'),
    section: localizedSection,
    localizedSections: typeof localizedSections === 'string' ? undefined : localizedSections,
    // Always call toOgImageUrl to ensure all params (title, eyebrow, image) are attached
    ogImage: toOgImageUrl(baseUrl, finalOgImage, t('title'), eyebrowText),
  });
}

export async function getBlogPostMetadata(params: PageParams): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!slug) return {};

  const { getPost, getPostTranslations } = await import('./blog');
  const post = await getPost(locale, slug);

  if (!post) return generatePageMetadata({
    params: Promise.resolve({ locale, slug }),
    title: 'Blog Post Not Found',
    description: 'The requested blog post could not be found.',
    section: '/blog',
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? DEFAULT_BASE;
  const translations = getPostTranslations(post.translationKey, locale);

  return generatePageMetadata({
    params: Promise.resolve({ locale, slug }),
    title: post.title ?? 'Blog Post',
    description: post.description ?? '',
    section: '/blog',
    keywords: post.tags ?? [],
    type: 'article',
    publishedTime: post.date,
    ogImage: post.coverImage ? toOgImageUrl(baseUrl, post.coverImage, post.title, post.category?.[0] ?? 'Blog') : undefined,
    category: post.category?.join(', '),
    alternates: translations.map(t => ({ locale: t.locale as Locale, slug: t.slug })),
  });
}

export async function getServiceMetadata(params: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find(s => s.slug === slug);

  if (!service) return generatePageMetadata({
    params,
    title: 'Service Not Found',
    description: 'The requested service could not be found.',
    section: 'hizmetler',
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? DEFAULT_BASE;

  return generatePageMetadata({
    params,
    title: service.titleKey,
    description: service.descriptionKey,
    section: '/hizmetler',
    localizedSections: pathnames['/hizmetler'],
    ogImage: service.image ? toOgImageUrl(baseUrl, service.image, service.titleKey, 'Hizmetler') : undefined,
  });
}