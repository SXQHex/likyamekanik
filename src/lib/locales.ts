// src/lib/locales.ts
import localesConfig from '@/config/locales.json';

export const locales = localesConfig.locales as readonly string[];
export type Locale = typeof localesConfig.locales[number];
export const defaultLocale: Locale = localesConfig.defaultLocale;
