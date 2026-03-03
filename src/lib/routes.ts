// src/lib/routes.ts
import { type Locale } from './locales';

export const localizedStaticSections: Record<string, Record<Locale, string>> = {
  home: { en: '', tr: '', ru: '', uk: '' },
  blog: { en: 'blog', tr: 'blog', ru: 'blog', uk: 'blog' },
  contact: { en: 'contact', tr: 'iletisim', ru: 'kontakt', uk: 'kontakt' },
  about: { en: 'about', tr: 'hakkimizda', ru: 'o-nas', uk: 'pro-nas' },
  services: { en: 'services', tr: 'hizmetler', ru: 'uslugi', uk: 'poslugi' },
};