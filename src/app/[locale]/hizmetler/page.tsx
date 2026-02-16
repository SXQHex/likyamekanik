import type { Metadata } from "next";
import { getTranslation } from "@/lib/i18n";
import { services } from "@/lib/services";
import { PageHeader } from "@/components/ui/PageHeader";
import { HoverEffect } from "@/components/ui/card-hover-effect";

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
    );
}
