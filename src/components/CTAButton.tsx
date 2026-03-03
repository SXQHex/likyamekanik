import { Link, type Href } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
    href: Href;
    children: React.ReactNode;
    variant?: "primary" | "outline";
    external?: boolean;
    className?: string;
}

export function CTAButton({
    href,
    children,
    variant = "primary",
    external = false,
    className,
}: CTAButtonProps) {
    const baseClasses =
        "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]";

    const variantClasses =
        variant === "primary"
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
            : "border-2 border-border bg-transparent text-foreground hover:bg-muted";
    const combinedClasses = cn(baseClasses, variantClasses, className);

    if (external) {
        return (
            <a
                href={href as string}
                target="_blank"
                rel="noopener noreferrer"
                className={combinedClasses}
            >
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className={combinedClasses}>
            {children}
        </Link>
    );
}