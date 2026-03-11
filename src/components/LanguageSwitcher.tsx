"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { locales, type Locale } from "@/lib/locales";

const localeLabels: Record<Locale, string> = {
  tr: "tr",
  en: "en",
  ru: "ru",
  uk: "uk",
};

const localeFull: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ru: "Русский",
  uk: "Українська",
};

export function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const [isOpen, setIsOpen] = useState(false);
  const [hrefs, setHrefs] = useState<Partial<Record<Locale, string>>>({});
  const ref = useRef<HTMLDivElement>(null);

  // Head'deki alternate linklerini oku
  useEffect(() => {
    const map: Partial<Record<Locale, string>> = {};
    locales.forEach((loc) => {
      const link = document.querySelector<HTMLLinkElement>(
        `link[rel="alternate"][hreflang="${loc}"]`
      );
      if (link?.href) {
        map[loc] = new URL(link.href).pathname;
      }
    });
    setHrefs(map);
  }, []);

  // Dışarı tıklayınca kapat
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 group transition-all duration-300 px-3 py-2 rounded-full hover:bg-white/10 hover:scale-110 active:scale-95"
      >
        <svg
          className={`w-5 h-5 text-primary group-hover:text-white transition-all duration-500 ${isOpen ? "rotate-360" : "group-hover:rotate-15"}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
        </svg>
        <span className="text-xs font-black text-white/50 tracking-wider group-hover:text-primary transition-colors">
          {currentLocale === "tr" ? "en" : "tr"}
        </span>
      </button>

      <div className={`
        absolute right-0 mt-3 w-44 bg-background border border-border rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-300
        ${isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-2 invisible"}
      `}>
        <div className="p-1">
          {locales.map((loc) => (
            <Link
              key={loc}
              href={hrefs[loc] ?? `/${loc}`}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center justify-between px-4 py-2.5 text-xs font-bold transition-all rounded-lg
                ${currentLocale === loc ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}
              `}
            >
              <span>{localeFull[loc]}</span>
              <span className="opacity-40">{localeLabels[loc]}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}