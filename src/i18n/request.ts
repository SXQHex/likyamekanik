import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from '@/lib/locales';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  const typedLocale = locale as Locale;

  let messages;

  try {
    messages = (await import(`../translations/${typedLocale}.json`)).default;
  } catch {
    messages = (await import(`../translations/${defaultLocale}.json`)).default;
  }

  return {
    locale: typedLocale,
    messages
  };
});
