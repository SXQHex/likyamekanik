import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './locales';

const hizmetler = { en: '/services', tr: '/hizmetler', ru: '/uslugi', uk: '/poslugi' } as const;
const hakkimizda = { en: '/about', tr: '/hakkimizda', ru: '/o-nas', uk: '/pro-nas' } as const;
const iletisim = { en: '/contact', tr: '/iletisim', ru: '/kontakt', uk: '/kontakt' } as const;

export const pathnames = {
    '/': '/',
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/hizmetler': hizmetler,
    '/hizmetler/[slug]': {
        en: `${hizmetler.en}/[slug]`,
        tr: `${hizmetler.tr}/[slug]`,
        ru: `${hizmetler.ru}/[slug]`,
        uk: `${hizmetler.uk}/[slug]`
    },
    '/hakkimizda': hakkimizda,
    '/iletisim': iletisim
} as const;

export const routing = defineRouting({
    locales,
    defaultLocale,
    localePrefix: 'always',
    pathnames
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

export type Pathname = keyof typeof pathnames;
export type StaticPathname = '/' | '/blog' | '/hizmetler' | '/hakkimizda' | '/iletisim';
export type DynamicHref =
    | { pathname: '/blog/[slug]'; params: { slug: string }; query?: any; hash?: string }
    | { pathname: '/hizmetler/[slug]'; params: { slug: string }; query?: any; hash?: string };

export type Href =
    | StaticPathname
    | { pathname: StaticPathname; query?: any; hash?: string }
    | DynamicHref;
