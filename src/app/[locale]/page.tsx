// src/app/[locale]/page.tsx
import Image from 'next/image';
import { Link } from "@/lib/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { services } from "@/lib/services";
import { getPageMetadata } from "@/lib/metadata";
import { locales, Locale } from "@/lib/locales";
import { PageHeader } from "@/components/ui/PageHeader";
import { BentoCard } from "@/components/BentoCard";
import { CTASection } from "@/components/CTASection";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/JsonLd";
import { DEFAULT_BASE, siteName } from "@/lib/metadata";

const headerImage = "/image/hero/mechanical-services-1.avif";

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export const generateMetadata = ({ params }: { params: Promise<{ locale: Locale }> }) =>
    getPageMetadata({ params, section: "/", namespace: "home", ogImage: headerImage });

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale });

    const homeSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": `${DEFAULT_BASE}/#website`,
                "url": DEFAULT_BASE,
                "name": siteName,
                "publisher": { "@id": `${DEFAULT_BASE}/#organization` },
                "inLanguage": locale
            },
            {
                "@type": "WebPage",
                "@id": `${DEFAULT_BASE}/${locale}/#webpage`,
                "url": `${DEFAULT_BASE}/${locale}`,
                "name": t("hero.title"),
                "isPartOf": { "@id": `${DEFAULT_BASE}/#website` },
                "about": { "@id": `${DEFAULT_BASE}/#organization` }
            }
        ]
    };

    return (
        <>
            <JsonLd schema={homeSchema} />
            {/* Hero Section */}
            <section className="relative min-h-[85vh] w-full overflow-hidden flex items-center px-4 py-20 sm:px-6">
                <div className="absolute inset-0 -z-10">
                    <Image
                        src={headerImage}
                        alt="Likya Mekanik Tesisat"
                        fill
                        priority
                        className="object-cover object-center"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-background/60" />

                    <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent" />
                </div>
                <div className="relative z-10 mx-auto max-w-7xl w-full text-left">
                    <h1 className="mb-6 text-4xl font-extrabold sm:text-5xl lg:text-7xl">
                        {t("hero.title")}
                    </h1>
                    <p className="mb-10 max-w-2xl text-lg sm:text-xl">
                        {t("hero.description")}
                    </p>
                    <a
                        href={`https://wa.me/905446415745?text=${encodeURIComponent(t("hero.cta.whatsappMessage"))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-12 items-center justify-center rounded-xl bg-secondary px-8 text-sm font-bold uppercase tracking-widest text-primary-muted border border-primary-muted transition-all hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/20 active:scale-95"
                    >
                        {t("cta.primary")}
                    </a>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent" />
            </section>

            {/* Bento Grid Services Preview */}
            <section className="px-4 py-16 sm:px-6 sm:py-24 overflow-hidden">
                <div className="mx-auto max-w-7xl">
                    <PageHeader title={t("services.title")} description={t("services.description")} />

                    {/* md:auto-rows-[300px] ekleyerek bento yüksekliğini sabitledik */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 md:auto-rows-[300px] gap-4">
                        {services.map((service, index) => {
                            // t() returns a string, so we access properties directly via keys
                            const title = t(`services.items.${service.id}.title`);
                            const description = t(`services.items.${service.id}.description`);
                            const IconComponent = service.icon;

                            const isLarge = service.id === "isi-pompasi";
                            const isTall = service.id === "yangin-sistemleri";
                            const isLast = index === services.length - 1;

                            // BentoCard'ın beklediği tüm verileri (slug ve seoTitle dahil) gönderiyoruz
                            const featureData = {
                                title: title,
                                description: description,
                                icon: <IconComponent size={24} />,
                                image: service.image || "/services/mechanical-services-2.avif",
                                imageAlt: title,
                                slug: `/hizmetler/${service.slugs[locale]}`, // TS hatası için gerekli
                                seoTitle: `${title} - Likya Mekanik Tesisat`,    // TS hatası için gerekli
                                className: cn(
                                    isLarge && "md:col-span-2",
                                    isTall && "md:row-span-2",
                                    isLast && "md:col-span-3"
                                ),
                                imageClassName: isLast ? "object-top" : "object-center"
                            };

                            return (
                                <Link
                                    key={service.id}
                                    href={{ pathname: '/hizmetler/[slug]', params: { slug: service.slugs[locale] } }}
                                    title={featureData.title}
                                    // contents yerine doğrudan col/row span'leri buraya taşıyoruz
                                    className={cn(
                                        "group/link relative flex flex-col h-full w-full min-h-0",
                                        featureData.className // Grid span sınıfları burada çalışacak
                                    )}
                                >
                                    <BentoCard
                                        feature={featureData}
                                        index={index} // Kartın Link'i doldurmasını sağla
                                    />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <CTASection
                title={t("cta.title")}
                description={t("cta.description")}
                button={t("cta.secondary")}
                whatsappMessage={t("cta.whatsappMessage")}
            />
        </>
    );
}