import trMessages from "@/translations/tr.json";
import enMessages from "@/translations/en.json";

export const locales = ["tr", "en", "ru", "ua"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

type Messages = typeof trMessages;

const messages: Record<string, Messages> = {
  tr: trMessages,
  en: enMessages,
  ru: trMessages,
  ua: trMessages,
};

export function getTranslation(locale: string): Messages {
  return messages[locale] ?? messages[defaultLocale];
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
