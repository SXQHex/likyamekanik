"use client";

import { Link, usePathname } from "@/lib/navigation";
import { useLocale } from "next-intl";
import { locales, type Locale } from "@/lib/locales";
import postsManifest from "@/app/[locale]/blog/posts-manifest.json";

const localeLabels: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  ru: "RU",
  uk: "UK"
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale();

  const getLocalizedHref = (path: string, currentLoc: string, targetLoc: string) => {
    if (path.startsWith('/blog/')) {
      const parts = path.split('/');
      // parts[0] is "", parts[1] is "blog", parts[2] is slug (if present)
      if (parts.length === 3 && parts[2]) {
        const slug = parts[2];
        const postsForCurrentLocale = (postsManifest as Record<string, any[]>)[currentLoc] || [];
        const post = postsForCurrentLocale.find((p: any) => p.slug === slug);

        if (post && post.slugs && post.slugs[targetLoc]) {
          return `/blog/${post.slugs[targetLoc]}`;
        }
      }
    }
    return path;
  };

  return (
    <div className="flex items-center gap-1">
      {locales.map((loc) => {
        const localizedHref = getLocalizedHref(pathname, currentLocale, loc);

        return (
          <Link
            key={loc}
            href={localizedHref}
            locale={loc}
            className={`rounded-md px-2 py-1 text-sm font-medium transition-colors ${loc === currentLocale
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
          >
            {localeLabels[loc as Locale]}
          </Link>
        );
      })}
    </div>
  );
}
