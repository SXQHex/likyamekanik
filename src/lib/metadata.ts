import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from './locales';
import { services } from './services';
import { localizedStaticSections } from './routes';

export const DEFAULT_BASE = "https://likyamekanik.com";
export const siteName = "Likya Mekanik";

export const ogLocales: Record<Locale, string> = {
  en: 'en_US',
  tr: 'tr_TR',
  ru: 'ru_RU',
  uk: 'uk_UA',
};

export function toOgWebpPath(imagePath: string): string {
  if (!imagePath) return '';
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const webpPath = cleanPath.replace(/\.(jpg|jpeg|png|avif|webp)$/i, '.webp');
  return `/og/${webpPath}`;
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
  return [base, locale, section, slug].filter(Boolean).join('/');
}

function toISOSafe(date?: string): string | undefined {
  if (!date) return undefined;
  try {
    const d = new Date(date);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  } catch { return undefined; }
}

export async function generatePageMetadata({
  params,
  title,
  description,
  section,
  localizedSections,
  keywords,
  ogImage,
  type = 'website',
  publishedTime,
  alternates,
  category = 'Engineering & Construction',
}: MetadataOptions): Promise<Metadata> {
  const { locale, slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? DEFAULT_BASE;

  const alternatesMap = Object.fromEntries(
    (alternates ?? [])
      .filter(a => a?.locale && locales.includes(a.locale))
      .map(a => [a.locale, a.slug])
  ) as Partial<Record<Locale, string>>;

  const languages = Object.fromEntries([
    ...locales.map(l => [
      l,
      makeUrl(baseUrl, l, localizedSections?.[l] ?? section, alternatesMap[l] ?? slug),
    ]),
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
      index: true,
      follow: true,
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

// ─── Page-level Helpers (tek satır kullanım) ─────────────────────────────────

/**
 * Statik sayfalar için — translation namespace + section yeterli.
 * Translation dosyasında "title" ve "description" key'leri olmalı.
 *
 * Kullanım:
 *   export const generateMetadata = ({ params }: Props) =>
 *     getPageMetadata({ params, namespace: "contact", section: "iletisim" });
 */
export async function getPageMetadata({
  params,
  section,
  namespace,
  ogImage,
}: {
  params: PageParams;
  section: keyof typeof localizedStaticSections;
  namespace?: string;
  ogImage?: string;
}): Promise<Metadata> { 
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: namespace ?? section});
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? DEFAULT_BASE;
  const localizedSections = localizedStaticSections[section];
  const localizedSection = (localizedSections as Record<Locale, string>)[locale] ?? section;
  
  return generatePageMetadata({
    params,
    title: t('title'),
    description: t('description'),
    section: localizedSection,
    localizedSections,
    ogImage: ogImage ? `${baseUrl}${toOgWebpPath(ogImage)}` : undefined,
  });
}

/**
 * Blog post sayfaları için Metadata oluşturucu.
 *
 * Kullanım:
 *   export const generateMetadata = ({ params }: Props) => getBlogPostMetadata(params);
 */
export async function getBlogPostMetadata(params: PageParams): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!slug) return {};

  const { getPost } = await import('./blog');
  const post = await getPost(locale, slug);

  if (!post) {
    return generatePageMetadata({
      params: Promise.resolve({ locale, slug }),
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
      section: 'blog', // localizedStaticSections['blog'] otomatik kullanılacak
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? DEFAULT_BASE;
  const ogImage = post.coverImage ? `${baseUrl}${toOgWebpPath(post.coverImage)}` : undefined;

  return generatePageMetadata({
    params: Promise.resolve({ locale, slug }),
    title: post.title ?? 'Blog Post',
    description: post.description ?? '',
    section: 'blog', 
    localizedSections: localizedStaticSections.blog, 
    keywords: post.tags ?? [],
    type: 'article',
    publishedTime: post.date,
    ogImage,
    category: post.category?.join(', '),
  });
}

/**
 * Hizmet sayfaları için.
 *
 * Kullanım:
 *   export const generateMetadata = ({ params }: Props) => getServiceMetadata(params);
 */
export async function getServiceMetadata(params: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find(s => s.slug === slug);

  if (!service) {
    return generatePageMetadata({
      params,
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
      section: 'hizmetler',
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? DEFAULT_BASE;
  const ogImage = service.image ? `${baseUrl}${toOgWebpPath(service.image)}` : undefined;

  return generatePageMetadata({
    params,
    title: service.titleKey,
    description: service.descriptionKey,
    section: 'hizmetler',
    localizedSections: { en: 'services', tr: 'hizmetler', ru: 'uslugi', uk: 'poslugi' },
    ogImage,
  });
}