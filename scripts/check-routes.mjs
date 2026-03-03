#!/usr/bin/env node

/**
 * Simple script to warn about routes not covered by localizedPathnames.
 * Run it before adding new routes or during CI to catch mismatches.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const PROJECT_ROOT = process.cwd();
const APP_DIR = path.join(PROJECT_ROOT, 'src/app/[locale]');
const ROUTES_FILE = path.join(PROJECT_ROOT, 'src/lib/routes.ts');

// Extract localizedPathnames keys from routes.ts (simple regex)
async function getPathnameKeys() {
  const content = await fs.readFile(ROUTES_FILE, 'utf8');
  const match = content.match(/export const localizedPathnames = \{([\s\S]*?)\} as const;/);
  if (!match) throw new Error('Could not find localizedPathnames');
  // Remove line breaks and extra spaces, then extract keys
  const flat = match[1].replace(/\s*\n\s*/g, ' ');
  const keys = [...flat.matchAll(/"\/([a-zA-Z0-9\-_\[\]]+)"(?=\s*:)/g)].map((m) => '/' + m[1]);
  // Also add dynamic patterns by replacing [slug] placeholders
  const dynamicKeys = [...flat.matchAll(/"\/([a-zA-Z0-9\-_]+)\/\[slug\]"(?=\s*:)/g)].map((m) => '/' + m[1] + '/[slug]');
  return new Set([...keys, ...dynamicKeys]);
}

// Find all page.tsx routes under src/app/[locale]
async function findActualRoutes() {
  const routes = new Set();
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.name === 'page.tsx') {
        const rel = path.relative(APP_DIR, path.dirname(full));
        const parts = rel.split(path.sep);
        const routePath = '/' + parts.join('/');
        routes.add(routePath);
      }
    }
  }
  await walk(APP_DIR);
  return routes;
}

function main() {
  (async () => {
    try {
      const pathnameKeys = await getPathnameKeys();
      const actualRoutes = await findActualRoutes();

      const uncovered = [...actualRoutes].filter((r) => {
        if (r === '/') return false;
        // If the route has a dynamic segment, check if the pattern exists
        if (r.includes('[')) {
          const pattern = r.replace(/\[.*?\]/g, '[slug]');
          if (pathnameKeys.has(pattern)) return false;
        }
        // Also check if the exact key exists
        if (pathnameKeys.has(r)) return false;
        return true;
      });
      if (uncovered.length) {
        console.warn('[routes] WARNING: Routes not covered in localizedPathnames:');
        uncovered.forEach((r) => console.warn('  -', r));
        console.warn('\nAdd them to src/lib/routes.ts to avoid i18n routing issues.');
        process.exit(1);
      } else {
        console.log('[routes] All routes covered in localizedPathnames.');
      }
    } catch (err) {
      console.error('[routes] Error:', err);
      process.exit(1);
    }
  })();
}

main();
