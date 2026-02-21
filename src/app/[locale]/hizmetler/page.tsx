// src/app/[locale]/hizmetler/page.tsx
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { services } from "@/lib/services";
import { PageHeader } from "@/components/ui/PageHeader";
import { ServiceCard } from "@/components/ServiceCard";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();
    return {
        title: t("services.title"),
        description: t("services.subtitle"),
    };
}

export default async function ServicesPage() {
    const locale = await getLocale();
    const t = await getTranslations();

    return (
        <section className="px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-6xl">
                <PageHeader
                    title={t("services.title")}
                    subtitle={t("services.subtitle")}
                    image="/services/mechanical-services-2.avif"
                />
                <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => {
                        const title = t(`services.items.${service.slug}.title`);
                        const description = t(`services.items.${service.slug}.description`);
                        return (
                            <ServiceCard
                                key={service.slug}
                                slug={service.slug}
                                title={title}
                                description={description}
                                // locale={locale} // Removed as not needed by ServiceCard anymore
                                viewDetailsLabel={t("services.viewDetails") || "Detayları Gör"} // Çeviri dosyasındaki key'e göre
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
