import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { locales, type Locale } from "@/lib/locales";
import { pathnames } from "@/lib/navigation";
import { getAllPosts, getPostTranslations } from "@/lib/blog";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://likyamekanik.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticRoutes: (keyof typeof pathnames)[] = ["/", "/hizmetler", "/hakkimizda", "/iletisim", "/blog"];

    const getLocalizedPath = (route: keyof typeof pathnames, locale: Locale) => {
        const routeDefinition = pathnames[route];
        if (typeof routeDefinition === 'string') return routeDefinition === '/' ? '' : routeDefinition;
        return (routeDefinition as Record<Locale, string>)[locale];
    };

    const entries: MetadataRoute.Sitemap = [];

    for (const locale of locales) {
        // Static Routes
        for (const route of staticRoutes) {
            const localizedPath = getLocalizedPath(route, locale);

            entries.push({
                url: `${BASE_URL}/${locale}${localizedPath}`,
                lastModified: now,
                changeFrequency: "monthly",
                priority: route === "/" ? 1 : 0.8,
                alternates: {
                    languages: Object.fromEntries(
                        locales.map((l) => [l, `${BASE_URL}/${l}${getLocalizedPath(route, l)}`]),
                    ),
                },
            });
        }

        // Services
        for (const service of services) {
            const servicePathDef = pathnames['/hizmetler/[slug]'] as Record<Locale, string>;
            const getServicePath = (l: Locale) => servicePathDef[l].replace('[slug]', service.slugs[l]);

            entries.push({
                url: `${BASE_URL}/${locale}${getServicePath(locale)}`,
                lastModified: now,
                changeFrequency: "monthly",
                priority: 0.7,
                alternates: {
                    languages: Object.fromEntries(
                        locales.map((l) => [
                            l,
                            `${BASE_URL}/${l}${getServicePath(l)}`,
                        ]),
                    ),
                },
            });
        }

        // Blog Posts
        const posts = await getAllPosts(locale);
        for (const post of posts) {
            const translations = getPostTranslations(post.translationKey, locale);

            const languages = Object.fromEntries(
                translations.map(t => [t.locale, `${BASE_URL}/${t.locale}/blog/${t.slug}`])
            );
            // Include current locale in alternates
            languages[locale] = `${BASE_URL}/${locale}/blog/${post.slug}`;

            entries.push({
                url: `${BASE_URL}/${locale}/blog/${post.slug}`,
                lastModified: post.date ? new Date(post.date) : now,
                changeFrequency: "weekly",
                priority: 0.6,
                alternates: {
                    languages,
                },
            });
        }
    }

    return entries;
}
