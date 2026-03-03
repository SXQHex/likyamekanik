// src/app/[locale]/hizmetler/page.tsx
import { getTranslations } from "next-intl/server";
import { services } from "@/lib/services";
import { PageHeader } from "@/components/ui/PageHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { Locale } from "@/lib/locales";
import { getPageMetadata } from "@/lib/metadata";

export const generateMetadata = ({ params }: { params: Promise<{ locale: Locale }> }) =>
    getPageMetadata({ params, section: "/hizmetler", namespace: "services" });

export default async function ServicesPage(params: { locale: Locale }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "services" });

    return (
        <>
            <section>
                <PageHeader
                    title={t("title")}
                    description={t("description")}
                    image="/services/mechanical-services-2.avif"
                />
            </section>
            <section className="px-4 py-4 sm:px-6 sm:py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => {
                            const title = t(`items.${service.slug}.title`);
                            const description = t(`items.${service.slug}.description`);
                            return (
                                <ServiceCard
                                    key={service.slug}
                                    slug={service.slug}
                                    title={title}
                                    description={description}
                                    // locale={locale} // Removed as not needed by ServiceCard anymore
                                    viewDetailsLabel={t("viewDetails") || "Detayları Gör"} // Çeviri dosyasındaki key'e göre
                                />
                            );
                        })}
                    </div>
                </div>
            </section></>
    );
}
