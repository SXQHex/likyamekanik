//src/components/ServiceCard.tsx
import { Link } from "@/lib/navigation";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter
} from "@/components/ui/card";

interface ServiceCardProps {
    slug: string;
    title: string;
    description: string;
    viewDetailsLabel: string;
}

export function ServiceCard({
    slug,
    title,
    description,
    viewDetailsLabel,
}: ServiceCardProps) {
    const servicePath = `/hizmetler/${slug}`;

    return (
        /* Kart artık bir Link değil, bağımsız bir div (group yine burada kalsın) */
        <Card className="card-base group flex h-full flex-col p-5">
            <CardHeader >
                <Link href={servicePath} className="inline-block">
                    <CardTitle className="hover:text-primary transition-colors duration-300">
                        {title}
                    </CardTitle>
                </Link>
            </CardHeader>

            <CardContent className="flex-1">
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
                    {description}
                </p>
            </CardContent>

            <CardFooter>
                <Link
                    href={servicePath}
                    className="inline-flex items-center text-sm font-semibold text-primary transition-all hover:opacity-80 group/btn"
                >
                    <span className="relative overflow-hidden">
                        {viewDetailsLabel}
                        {/* Alt çizgi efekti gibi ekstra bir görsel ipucu eklenebilir */}
                        <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover/btn:scale-x-100" />
                    </span>

                    <svg
                        className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </CardFooter>
        </Card>
    );
}