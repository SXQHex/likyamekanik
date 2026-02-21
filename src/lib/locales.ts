export const locales = ["tr", "en", "ru", "uk"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";
