// src/lib/og-generator.ts
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

async function generateStaticOG(
    title: string, 
    eyebrow: string, 
    imagePath: string | null, 
    slug: string
) { 
  // 1. Font Yükleme (Hata payını sıfırlamak için şart)
  // Projenin kök dizinine göre font yolunu ayarla
  const fontPath = path.join(process.cwd(), 'src/assets/fonts/Geist/static/Geist-Bold.ttf');  
  if (!fs.existsSync(fontPath)) {
    throw new Error(`Font bulunamadı: ${fontPath}. Lütfen fontu belirttiğin konuma ekle.`);
  }
  
  const fontData = fs.readFileSync(fontPath);

  // 2. Arka Plan Görselini Hazırlama (Base64)
  let base64Image = "";
  if (imagePath) {
    const fullImagePath = path.join(process.cwd(), 'public', imagePath);
    if (fs.existsSync(fullImagePath)) {
      const imageBuffer = fs.readFileSync(fullImagePath);
      // Not: Satori image tag'i için base64 string bekler
      base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    }
  }

  // 3. Satori ile SVG Oluşturma
  // NOT: Satori JSX benzeri bir obje yapısı bekler (React.createElement çıktısı gibi)
  // ... üstteki importlar ve hazırlıklar aynı

  // 3. Satori ile SVG Oluşturma
  const svg = await satori(
    // 1. Önce unknown'a, sonra ReactNode'a (veya any'ye) çeviriyoruz.
    // 2. ESLint uyarısını sadece bu satır için kapatıyoruz.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          backgroundColor: '#0a0a0a',
        },
        children: [
          base64Image ? {
            type: 'img',
            props: {
              src: base64Image,
              style: {
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.4,
              },
            },
          } : null,
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.75) 60%, rgba(10,10,10,0.2) 100%)',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '64px 80px',
                gap: '16px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex' },
                    children: [{
                      type: 'span',
                      props: {
                        style: {
                          backgroundColor: 'rgba(220,124,60, 0.15)',
                          border: '1px solid rgba(220,124,60, 0.3)',
                          color: '#dc7c3c',
                          fontSize: '13px',
                          fontWeight: 700,
                          padding: '6px 16px',
                          borderRadius: '999px',
                        },
                        children: eyebrow,
                      }
                    }]
                  }
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: title.length > 30 ? '48px' : '60px',
                      fontWeight: 900,
                      color: '#f5f0e8',
                      lineHeight: 1.05,
                      maxWidth: '700px',
                    },
                    children: title,
                  }
                },
                {
                    type: 'div',
                    props: {
                        style: {
                        fontSize: '18px',
                        fontWeight: 500,
                        color: 'rgba(245,240,232,0.45)',
                        letterSpacing: '0.08em',
                        marginTop: '8px',
                        },
                        children: 'likyamekanik.com',
                    }
                }
              ].filter(Boolean)
            }
          }
        ].filter(Boolean)
      }
    } as unknown) as React.ReactNode, 
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Geist',
          data: fontData,
          weight: 900,
          style: 'normal',
        },
      ],
    }
  );

  // 4. PNG'ye Dönüştürme
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  // 5. Kaydetme
  const outputDir = path.join(process.cwd(), 'public/og');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileName = `${slug}.png`;
  const filePath = path.join(outputDir, fileName);
  fs.writeFileSync(filePath, pngBuffer);

  console.log(`✅ OG Generated: ${fileName}`);
}
export { generateStaticOG };