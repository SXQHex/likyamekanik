interface PageHeaderProps {
    title: string;
    subtitle?: string;
    eyebrow?: string;
}

export function PageHeader({ title, subtitle, eyebrow }: PageHeaderProps) {
    return (
        <div className="mb-12 text-left">
            {eyebrow && (
                <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                    {eyebrow}
                </span>
            )}
            <h1 className="mb-3 text-4xl font-bold text-foreground">{title}</h1>
            {subtitle && (
                <p className="max-w-2xl text-lg text-muted-foreground">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
