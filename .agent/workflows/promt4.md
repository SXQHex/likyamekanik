---
description: Services Data Source (Single Source of Truth)
---

Task: Create a single services registry file.

Create:

src/lib/services.ts

Include exactly 5 services:

- yangin-sistemleri
- isi-pompasi
- yerden-isitma
- havalandirma
- havuz-tesisati

Each service must have:
- slug
- titleKey
- descriptionKey

Translation content must live in JSON files, not hardcoded.

Expected output:
- services.ts exports a typed array usable in all pages.