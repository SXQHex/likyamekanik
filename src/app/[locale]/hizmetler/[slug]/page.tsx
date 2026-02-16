import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslation, locales } from "@/lib/i18n";
import { services } from "@/lib/services";
import { CTAButton } from "@/components/CTAButton";

export function generateStaticParams() {
    return locales.flatMap((locale) =>
        services.map((s) => ({ locale, slug: s.slug })),
    );
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;
    const t = getTranslation(locale);
    const item =
        t.services.items[slug as keyof typeof t.services.items];

    if (!item) return {};

    return {
        title: item.title,
        description: item.description,
    };
}

export default async function ServiceDetailPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const service = services.find((s) => s.slug === slug);
    if (!service) notFound();

    const t = getTranslation(locale);
    const item =
        t.services.items[slug as keyof typeof t.services.items];

    if (!item) notFound();

    return (
        <section className="px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-3xl">
                {/* Back link */}
                <Link
                    href={`/${locale}/hizmetler`}
                    className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    {t.serviceDetail.backToServices}
                </Link>

                {/* Title */}
                <h1 className="mb-4 text-4xl font-bold text-foreground">
                    {item.title}
                </h1>
                <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                    {item.longDescription}
                </p>

                {/* Features */}
                <div className="mb-10 rounded-xl border border-border bg-card p-6">
                    <h2 className="mb-4 text-xl font-semibold text-card-foreground">
                        {t.serviceDetail.features}
                    </h2>
                    <ul className="space-y-3">
                        {item.features.map((feature) => (
                            <li
                                key={feature}
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
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Service Area */}
                <div className="mb-10 rounded-xl border border-border bg-card p-6">
                    <h2 className="mb-2 text-xl font-semibold text-card-foreground">
                        {t.serviceDetail.serviceArea}
                    </h2>
                    <p className="text-muted-foreground">
                        {t.serviceDetail.serviceAreaList}
                    </p>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <CTAButton
                        href={`https://wa.me/905446415745?text=${encodeURIComponent(item.title)}`}
                        external
                    >
                        {t.serviceDetail.whatsappCta}
                    </CTAButton>
                </div>
            </div>
        </section>
    );
}
