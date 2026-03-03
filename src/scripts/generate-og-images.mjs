#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PUBLIC_DIR = path.join(__dirname, '../../public');
const OG_DIR = path.join(PUBLIC_DIR, 'og');
const BLOG_CONTENT_DIR = path.join(__dirname, '../../src/app/[locale]/blog/content');
const SERVICES_DIR = path.join(PUBLIC_DIR, 'services');

// OG image dimensions
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Ensure OG directory exists
async function ensureOgDir() {
  try {
    await fs.access(OG_DIR);
  } catch {
    await fs.mkdir(OG_DIR, { recursive: true });
  }
}

// Generate OG image for a single source image
async function generateOgImage(sourcePath, outputPath) {
  try {
    await fs.access(sourcePath);

    await sharp(sourcePath)
      .resize(OG_WIDTH, OG_HEIGHT, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 })
      .toFile(outputPath);

    console.log(`✓ Generated OG image: ${path.relative(PUBLIC_DIR, outputPath)}`);
  } catch (error) {
    console.warn(`⚠️  Could not process ${sourcePath}: ${error.message}`);
  }
}

// Collect all images from blog posts
async function collectBlogImages() {
  const images = new Set();

  try {
    const localesConfigPath = path.join(__dirname, '../../src/config/locales.json');
    const localesConfig = JSON.parse(await fs.readFile(localesConfigPath, 'utf-8'));
    const locales = localesConfig.locales;

    for (const locale of locales) {
      const localeDir = path.join(BLOG_CONTENT_DIR, locale);

      try {
        const entries = await fs.readdir(localeDir, { withFileTypes: true });

        for (const entry of entries) {
          if (entry.isDirectory()) {
            const mdxPath = path.join(localeDir, entry.name, 'page.mdx');

            try {
              const content = await fs.readFile(mdxPath, 'utf-8');

              // Extract coverImage from frontmatter
              const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
              if (frontmatterMatch) {
                const frontmatter = frontmatterMatch[1];
                const coverImageMatch = frontmatter.match(/coverImage:\s*["']?([^"'\n]+)["']?/);

                if (coverImageMatch) {
                  const coverImage = coverImageMatch[1].trim();
                  if (coverImage && !coverImage.startsWith('http')) {
                    images.add(coverImage);
                  }
                }
              }
            } catch (error) {
              // Skip if file doesn't exist or can't be read
            }
          }
        }
      } catch (error) {
        // Skip if locale directory doesn't exist
      }
    }
  } catch (error) {
    console.warn('Error collecting blog images:', error.message);
  }

  return Array.from(images);
}

// Collect all service images
async function collectServiceImages() {
  const images = new Set();

  try {
    const entries = await fs.readdir(SERVICES_DIR, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && /\.(jpg|jpeg|png|avif|webp)$/i.test(entry.name)) {
        images.add(`/services/${entry.name}`);
      }
    }
  } catch (error) {
    console.warn('Error collecting service images:', error.message);
  }

  return Array.from(images);
}

// Collect hardcoded page header images
function collectPageHeaderImages() {
  return [
    '/pipework.avif',
    '/services/mechanical-services-2.avif',
    '/contact.avif'
  ];
}

// Main function
async function generateOgImages() {
  console.log('🎨 Starting OG image generation...\n');

  await ensureOgDir();

  // Collect all images
  const blogImages = await collectBlogImages();
  const serviceImages = await collectServiceImages();
  const pageHeaderImages = collectPageHeaderImages();

  const allImages = [...blogImages, ...serviceImages, ...pageHeaderImages];

  console.log(`Found ${allImages.length} images to process:\n`);

  // Generate OG images for each source image
  for (const imagePath of allImages) {
    const sourcePath = path.join(PUBLIC_DIR, imagePath);
    const webpPath = imagePath.replace(/\.(jpg|jpeg|png|avif|webp)$/i, '.webp');
    const outputPath = path.join(OG_DIR, path.basename(webpPath));

    // Create subdirectory if needed
    const outputSubDir = path.dirname(outputPath);
    if (outputSubDir !== OG_DIR) {
      await fs.mkdir(outputSubDir, { recursive: true });
    }

    await generateOgImage(sourcePath, outputPath);
  }

  console.log(`\n✅ OG image generation complete!`);
  console.log(`📁 Generated images are in: ${path.relative(process.cwd(), OG_DIR)}`);
}

// Run the script
generateOgImages().catch(error => {
  console.error('❌ Error generating OG images:', error);
  process.exit(1);
});
