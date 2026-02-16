import { getTranslation } from "@/lib/i18n";
import { services } from "@/lib/services";
import { CTAButton } from "@/components/CTAButton";


import { PageHeader } from "@/components/ui/PageHeader";
import { HoverEffect } from "@/components/ui/card-hover-effect";

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = getTranslation(locale);

    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-accent/5 px-4 py-20 sm:px-6 sm:py-32">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        {t.hero.title}
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                        {t.hero.subtitle}
                    </p>
                    <CTAButton
                        href={`https://wa.me/905446415745`}
                        external
                    >
                        {t.hero.cta}
                    </CTAButton>
                </div>
                {/* Decorative gradient orb */}
                <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            </section>

            {/* Services Preview */}
            <section className="px-4 py-16 sm:px-6 sm:py-24">
                <div className="mx-auto max-w-6xl">
                    <PageHeader title={t.services.title} subtitle={t.services.subtitle} />

                    <HoverEffect
                        items={services.map((service) => {
                            const item = t.services.items[service.slug as keyof typeof t.services.items];
                            return {
                                title: item.title,
                                description: item.description,
                                link: `/${locale}/hizmetler/${service.slug}`,
                            };
                        })}
                    />
                </div>
            </section>
        </>
    );
}
