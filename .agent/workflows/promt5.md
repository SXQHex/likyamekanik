---
description: Hizmetler Landing Page (Auto Cards)
---

Task: Implement /hizmetler page that automatically lists services.

Requirements:
1. Page: src/app/[locale]/hizmetler/page.tsx
2. Import services from src/lib/services.ts
3. Render ServiceCard for each item.
4. Links must go to:

/[locale]/hizmetler/{slug}

Expected output:
- Adding a service in services.ts automatically adds a card.