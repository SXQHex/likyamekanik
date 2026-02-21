---
description: Locale System (TR/EN + RU/UA scaffold)
---

Task: Implement locale-based routing with /tr and /en working.

Requirements:
1. Supported locales: tr, en, ru, ua
2. Default locale: tr
3. URLs must be:

/tr/...
/en/...
/ru/...
/uk/...

4. Add translation message files:

src/translations/tr.json
src/translations/en.json
src/translations/ru.json (empty placeholder)
src/translations/ua.json (empty placeholder)

5. Add minimal translation keys:
- nav.home, nav.services, nav.about, nav.contact, nav.blog
- hero.title, hero.subtitle, hero.cta

Expected output:
- Visiting /tr shows Turkish
- Visiting /en shows English
- RU/UA routes exist but fallback tr