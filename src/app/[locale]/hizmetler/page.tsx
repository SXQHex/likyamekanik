import { getTranslations } from "next-intl/server";
import { services } from "@/lib/services";
import { getPageMetadata, type PageParams } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/PageHeader";
import { CTASection } from "@/components/CTASection";
import { ServiceListCard } from "@/components/ServiceListCard";

const headerImage = "/services/mechanical-services-2.avif";

export const generateMetadata = ({ params }: { params: PageParams }) =>
    getPageMetadata({ params, section: "/hizmetler", namespace: "services", ogImage: headerImage });

export default async function ServicesPage({ params }: { params: PageParams }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "services" });

    return (
        <>
            <PageHeader
                eyebrow={t("eyebrow")}
                title={t("title")}
                description={t("description")}
                image={headerImage}
            />

            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="flex flex-col gap-4">
                    {services.map((service, index) => (
                        <ServiceListCard
                            key={service.slug}
                            slug={service.slug}
                            title={t(`items.${service.slug}.title`)}
                            description={t(`items.${service.slug}.description`)}
                            index={index}
                        />
                    ))}
                </div>
            </div>

            <CTASection
                title={t("cta.title")}
                description={t("cta.description")}
                button={t("cta.button")}
                whatsappMessage={t("cta.whatsappMessage")}
            />
        </>
    );
}