// scripts/generate-og-images.mjs
import sharp from "sharp";
import { readdir, mkdir, stat, rm } from "fs/promises";
import { join, relative } from "path";

const INPUT_DIR = "./public/image";
const OUTPUT_DIR = "./public/og";

async function processDir(dir) {
  const entries = await readdir(dir);
  const results = { success: 0, failed: 0 };

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const info = await stat(fullPath);

    if (info.isDirectory()) {
      const sub = await processDir(fullPath);
      results.success += sub.success;
      results.failed += sub.failed;
    } else if (entry.endsWith(".avif")) {
      const relPath = relative(INPUT_DIR, fullPath);
      const outPath = join(OUTPUT_DIR, relPath).replace(".avif", ".png");

      await mkdir(join(outPath, ".."), { recursive: true });

      try {
        await sharp(fullPath)
          .resize(1200, 630, {
            fit: "cover",
            position: "attention",
          })
          .png({
            compressionLevel: 9,
            palette: false,
          })
          .toFile(outPath);

        console.log(`✓ ${relPath}`);
        results.success++;
      } catch (err) {
        console.error(`✗ HATA: ${relPath}`);
        console.error(`  → ${err.message}`);
        results.failed++;
      }
    }
  }

  return results;
}

// Temizle
console.log("🗑️  Eski og/ klasörü temizleniyor...");
await rm(OUTPUT_DIR, { recursive: true, force: true });
await mkdir(OUTPUT_DIR, { recursive: true });
console.log("📁  Temizlendi, görseller oluşturuluyor...\n");

const { success, failed } = await processDir(INPUT_DIR);

console.log(`\n${failed === 0 ? "🎉" : "⚠️ "} Tamamlandı: ${success} başarılı${failed > 0 ? `, ${failed} hatalı` : ""}.`);

if (failed > 0) {
  process.exit(1); // Netlify build'i durdurur, sessizce geçmez
}