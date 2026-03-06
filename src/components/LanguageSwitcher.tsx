"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { locales } from "@/lib/locales";

const localeLabels: Record<string, string> = {
  tr: "TR",
  en: "EN",
  ru: "RU",
  uk: "UK",
};

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();

  function handleSwitch(targetLocale: string) {
    if (targetLocale === currentLocale) return;

    const el = document.querySelector(
      `link[rel="alternate"][hreflang="${targetLocale}"]`
    );
    const href = el?.getAttribute("href");

    if (href) {
      // Absolute URL'den sadece pathname'i al → client-side soft navigation
      router.push(new URL(href).pathname, { scroll: false });
    }
  }

  return (
    <div className="flex items-center gap-1">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleSwitch(loc)}
          className={`rounded-md px-2 py-1 text-sm font-medium transition-colors ${loc === currentLocale
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
        >
          {localeLabels[loc] ?? loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
