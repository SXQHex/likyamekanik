"use client";

import { Link, usePathname } from "@/lib/navigation";
import { useLocale } from "next-intl";
import { locales, type Locale } from "@/lib/locales";

const localeLabels: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  ru: "RU",
  uk: "UK"
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale();

  return (
    <div className="flex items-center gap-1">
      {locales.map((loc) => {
        return (
          <Link
            key={loc}
            href={pathname}
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
