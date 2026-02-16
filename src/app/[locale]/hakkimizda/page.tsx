import type { Metadata } from "next";
import { getTranslation } from "@/lib/i18n";
import { PageHeader } from "@/components/ui/PageHeader";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = getTranslation(locale);
    return {
        title: t.about.title,
        description: t.about.intro,
    };
}

export default async function AboutPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = getTranslation(locale);

    return (
        <section className="px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-3xl">
                <PageHeader title={t.about.title} subtitle={t.about.intro} />

                <div className="space-y-6">
                    <p className="leading-relaxed text-muted-foreground">
                        {t.about.p1}
                    </p>
                    <p className="leading-relaxed text-muted-foreground">
                        {t.about.p2}
                    </p>
                </div>

                {/* Values */}
                <div className="mt-12 rounded-xl border border-border bg-card p-6">
                    <h2 className="mb-6 text-2xl font-bold text-card-foreground">
                        {t.about.valuesTitle}
                    </h2>
                    <ul className="grid gap-4 sm:grid-cols-2">
                        {t.about.values.map((value) => (
                            <li
                                key={value}
                                className="flex items-start gap-3 text-muted-foreground"
                            >
                                <svg
                                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                {value}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
