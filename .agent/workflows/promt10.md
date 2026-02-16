---
description: Production Readiness Check (No Deploy)
---

Task: Final production readiness validation.

Steps:
1. Run:
pnpm lint
pnpm build

2. Fix all TypeScript and route errors.
3. Ensure no Node fs imports leak into client components.
4. Provide a manual deployment checklist for:
- GitHub
- Vercel
- Cloudflare Pages

Expected output:
- pnpm build succeeds.
- Repo is ready for manual deployment.