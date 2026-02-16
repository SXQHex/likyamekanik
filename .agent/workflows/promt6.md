---
description: Service Detail Pages (SEO MVP)
---

Task: Implement dynamic service detail route.

File:
src/app/[locale]/hizmetler/[slug]/page.tsx

Requirements:
1. Validate slug exists in services.ts, otherwise 404.
2. Render:
- H1 title
- Short description
- Bullet list (hardcoded generic, no pretentious claims)
- Service area mention: Fethiye, Göcek, Dalaman, Ortaca, Kaş
- CTA button: WhatsApp teklif al

Expected output:
- All 5 services open correctly.
- SEO metadata per service.