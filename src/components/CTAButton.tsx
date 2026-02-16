import Link from "next/link";

interface CTAButtonProps {
    href: string;
    children: React.ReactNode;
    variant?: "primary" | "outline";
    external?: boolean;
}

export function CTAButton({
    href,
    children,
    variant = "primary",
    external = false,
}: CTAButtonProps) {
    const baseClasses =
        "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]";

    const variantClasses =
        variant === "primary"
            ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25"
            : "border-2 border-border text-foreground hover:bg-muted";

    const className = `${baseClasses} ${variantClasses}`;

    if (external) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
            >
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    );
}
