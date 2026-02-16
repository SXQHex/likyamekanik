import { getTranslation } from "@/lib/i18n";
import { services } from "@/lib/services";
import { ServiceCard } from "@/components/ServiceCard";
import { CTAButton } from "@/components/CTAButton";

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
                    <div className="mb-12 text-center">
                        <h2 className="mb-3 text-3xl font-bold text-foreground">
                            {t.services.title}
                        </h2>
                        <p className="text-muted-foreground">{t.services.subtitle}</p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => {
                            const item =
                                t.services.items[
                                service.slug as keyof typeof t.services.items
                                ];
                            return (
                                <ServiceCard
                                    key={service.slug}
                                    slug={service.slug}
                                    title={item.title}
                                    description={item.description}
                                    locale={locale}
                                    viewDetailsLabel={t.services.viewDetails}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
