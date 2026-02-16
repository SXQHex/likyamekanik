import type { Metadata } from "next";
import { getTranslation } from "@/lib/i18n";
import { services } from "@/lib/services";
import { ServiceCard } from "@/components/ServiceCard";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = getTranslation(locale);
    return {
        title: t.services.title,
        description: t.services.subtitle,
    };
}

export default async function ServicesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = getTranslation(locale);

    return (
        <section className="px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-6xl">
                <div className="mb-12 text-center">
                    <h1 className="mb-3 text-4xl font-bold text-foreground">
                        {t.services.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {t.services.subtitle}
                    </p>
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
    );
}
