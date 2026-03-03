import Image from "next/image";
import { Link } from "@/lib/navigation";


interface PageHeaderProps {
    title: string;
    description?: string;
    eyebrow?: string;
    image?: string; // Opsiyonel image
    imagePosition?:string;
    imageAlt?: string;
    backLinkHref?: string;
    backLinkLabel?: string;
}

export function PageHeader({ title, description, eyebrow, image, imagePosition = "object-center", imageAlt, backLinkHref, backLinkLabel }: PageHeaderProps) {
    return (
        <div className="relative w-full overflow-hidden min-h-50 flex items-center">

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
                    <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-transparent z-10" />
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
                        <span className="inline-block px-4 py-1.5 mb-5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                            {eyebrow}
                        </span>
                    </div>
                )}
                <h1 className={`mb-3 text-4xl font-bold drop-shadow-md text-foreground`}>
                    {title}
                </h1>
                {description && (
                    <p className={`max-w-2xl text-lg leading-relaxed drop-shadow-sm text-foreground/90`}>
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}