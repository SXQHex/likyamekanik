---
description: Project Cleanup + Folder Layout
---

Task: Convert the default Next.js starter into a real business website skeleton.

Steps:
1. Remove boilerplate content from src/app/page.tsx.
2. Create this exact route structure:

src/app/[locale]/
  layout.tsx
  page.tsx

  hizmetler/
    page.tsx
    [slug]/
      page.tsx

  hakkimizda/
    page.tsx

  iletisim/
    page.tsx

  blog/
    page.tsx
    [slug]/
      page.tsx

3. Create shared components:

src/components/
  Header.tsx
  Footer.tsx
  ServiceCard.tsx
  LanguageSwitcher.tsx
  CTAButton.tsx
  ThemeProvider.tsx
  ThemeToggle.tsx


Expected output:
- All routes exist and return simple placeholder content.
- Navigation does not break.