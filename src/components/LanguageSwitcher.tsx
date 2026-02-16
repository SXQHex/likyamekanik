"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

const localeLabels: Record<Locale, string> = {
    tr: "TR",
    en: "EN",
    ru: "RU",
    ua: "UA",
};

const activeLocales: Locale[] = ["tr", "en"];

export function LanguageSwitcher({ locale }: { locale: string }) {
    const pathname = usePathname();

    function getLocalizedPath(targetLocale: string) {
        const segments = pathname.split("/");
        if (locales.includes(segments[1] as Locale)) {
            segments[1] = targetLocale;
        }
        return segments.join("/") || `/${targetLocale}`;
    }

    return (
        <div className="flex items-center gap-1">
            {activeLocales.map((loc) => (
                <Link
                    key={loc}
                    href={getLocalizedPath(loc)}
                    className={`rounded-md px-2 py-1 text-sm font-medium transition-colors ${loc === locale
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                >
                    {localeLabels[loc]}
                </Link>
            ))}
        </div>
    );
}
