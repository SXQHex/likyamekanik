import Image from "next/image";
import { Link, type StaticPathname } from "@/lib/navigation";


interface PageHeaderProps {
    title: string;
    description?: string;
    eyebrow?: string;
    image?: string; // Opsiyonel image
    imagePosition?: string;
    imageAlt?: string;
    backLinkHref?: StaticPathname;
    backLinkLabel?: string;
}

export function PageHeader({ title, description, eyebrow, image, imagePosition = "object-center", imageAlt, backLinkHref, backLinkLabel }: PageHeaderProps) {
    return (
        <div className="relative w-full overflow-hidden min-h-30 md:min-h-50 flex items-center">

            {/* 1. Arka Plan Katmanı (Sadece image varsa render edilir) */}
            {image && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={image}
                        alt={imageAlt || title}
                        fill
                        priority
                        className={`object-cover ${imagePosition}`}
                        sizes="100vw"
                    />
                    {/* Okunabilirlik için Karartma (Scrim) */}
                    {/* Sol taraftaki metinlerin okunabilirliği için yatay gradyan */}
                    <div className="absolute inset-0 z-10 bg-linear-to-r from-background from-0% via-background/80 via-45% to-transparent to-80%" />

                    {/* Resmin alt kenarını zemine gömmek için dikey gradyan */}
                    <div className="absolute inset-0 z-10 bg-linear-to-t from-background via-background/10 via-45% to-transparent to-65%" />
                </div>
            )}

            {/* 2. Orijinal İçerik Katmanı (Hiçbir sınıfa dokunulmadı) */}
            <div className={`relative z-20 px-8 md:px-12 ${image ? 'text-left' : ''}`}>
                {/* Opsiyonel Geri Dönüş Linki */}
                {backLinkHref && backLinkLabel && (
                    <Link
                        href={backLinkHref}
                        className="inline-flex items-center mb-4 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        {backLinkLabel}
                    </Link>
                )}
                {eyebrow && (
                    <div className="block">
                        <span className="inline-block px-4 py-1.5 mb-5 rounded-sm bg-secondary/80 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                            {eyebrow}
                        </span>
                    </div>
                )}
                <h1 className={`mb-3 text-4xl font-bold text-shadow-md text-foreground`}>
                    {title}
                </h1>
                {description && (
                    <p className={`max-w-lg md:max-w-xl lg:max-w-3xl text-lg leading-relaxed text-foreground text-shadow-lg`}>
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}