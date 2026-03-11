import Image from 'next/image';

/**
 * ImageCaption — Açıklamalı görsel bileşeni
 *
 * @param src       - Görsel yolu (/static/... veya tam URL)
 * @param alt       - Erişilebilirlik için zorunlu alternatif metin
 * @param caption   - Görsel altı açıklama metni (opsiyonel)
 * @param source    - Kaynak adı, örn. "TS EN 12845" (opsiyonel)
 * @param sourceUrl - Kaynak bağlantısı, belirtilirse tıklanabilir olur (opsiyonel)
 * @param priority  - LCP görseli için true yap (varsayılan: false)
 *
 * @example
 * <ImageCaption
 *   src="/static/yangin-sprinkler.jpg"
 *   alt="Sprinkler başlığı kesit görünümü"
 *   caption="Şekil 3 — Sprinkler başlığı iç yapısı"
 *   source="TS EN 12845"
 *   sourceUrl="https://tse.org.tr"
 * />
 */
interface ImageCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  source?: string;
  sourceUrl?: string;
  priority?: boolean;
}

export default function ImageCaption({
  src,
  alt,
  caption,
  source,
  sourceUrl,
  priority = false,
}: ImageCaptionProps) {
  return (
    <figure className="my-6">
      <div className="relative w-full overflow-hidden rounded-xl border border-border aspect-video">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          sizes="(max-width: 896px) 100vw, 896px"
        />
      </div>
      {(caption || source) && (
        <figcaption className="mt-2 flex flex-wrap items-start justify-between gap-2 text-xs text-muted-foreground px-1">
          {caption && <span>{caption}</span>}
          {source && (
            <span className="shrink-0">
              Kaynak:{' '}
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  {source}
                </a>
              ) : (
                source
              )}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}