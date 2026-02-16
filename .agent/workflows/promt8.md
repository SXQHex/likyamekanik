---
description: Blog MVP with MDX (Locale Slugs)
---

Task: Add MDX blog system.

Requirements:
1. Add MDX support in next.config.ts
2. Content folder:

content/blog/
  tr/
  en/

3. Add two example posts:

content/blog/tr/isi-pompasi-nedir.mdx
content/blog/en/what-is-a-heat-pump.mdx

4. Blog index page lists posts for current locale.
5. Blog detail page loads correct MDX file by slug.

Expected output:
- URLs:

/tr/blog/isi-pompasi-nedir
/en/blog/what-is-a-heat-pump

- Works without CMS.