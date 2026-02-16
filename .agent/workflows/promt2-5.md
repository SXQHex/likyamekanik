---
description: Theme System Foundation
---

Task: Implement global theme infrastructure.

Steps:
1. Install dependency:
pnpm add next-themes

2. Configure Tailwind:
- Enable darkMode: "class"
- Define CSS variables in globals.css for:
  --background
  --foreground
  --card
  --border

3. Create:

src/components/ThemeProvider.tsx
src/components/ThemeToggle.tsx

4. Wrap the entire app in ThemeProvider inside src/app/[locale]/layout.tsx

Expected output:
- Theme persists across refresh.
- Default theme: system.
