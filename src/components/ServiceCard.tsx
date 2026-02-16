import Link from "next/link";

interface ServiceCardProps {
    slug: string;
    title: string;
    description: string;
    locale: string;
    viewDetailsLabel: string;
}

export function ServiceCard({
    slug,
    title,
    description,
    locale,
    viewDetailsLabel,
}: ServiceCardProps) {
    return (
        <Link
            href={`/${locale}/hizmetler/${slug}`}
            className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
        >
            <h3 className="mb-3 text-xl font-bold text-card-foreground transition-colors group-hover:text-primary">
                {title}
            </h3>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {description}
            </p>
            <span className="inline-flex items-center text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
                {viewDetailsLabel}
                <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </span>
        </Link>
    );
}
