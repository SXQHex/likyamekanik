
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPageMetadata } from "@/lib/metadata";
import { Locale } from "@/lib/locales";

export const generateMetadata = ({ params }: { params: Promise<{ locale: Locale }> }) =>
    getPageMetadata({ params, section: "/iletisim", namespace: "contact" });

export default async function ContactPage(params: { locale: Locale }) {
    const { locale } = await params;

    const t = await getTranslations({ locale, namespace: "contact" });

    const phoneClean = t("phoneNumber").replace(/\s/g, "");

    return (
        <section className="px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-3xl">
                <PageHeader title={t("title")} description={t("description")} />

                <div className="grid gap-6 sm:grid-cols-2">
                    {/* Phone */}
                    <a
                        href={`tel:${phoneClean}`}
                        className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
                    >
                        <div className="rounded-lg bg-primary/10 p-3">
                            <svg
                                className="h-6 w-6 text-primary"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-card-foreground">
                                {t("phone")}
                            </h3>
                            <p className="text-muted-foreground">
                                {t("phoneNumber")}
                            </p>
                        </div>
                    </a>

                    {/* WhatsApp */}
                    <a
                        href={`https://wa.me/${phoneClean.replace("+", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-green-500/50 hover:shadow-md"
                    >
                        <div className="rounded-lg bg-green-500/10 p-3">
                            <svg
                                className="h-6 w-6 text-green-600 dark:text-green-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.11.546 4.097 1.505 5.831L0 24l6.335-1.463A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.96 0-3.83-.525-5.47-1.516l-.393-.233-3.755.868.906-3.644-.256-.408A9.697 9.697 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-card-foreground">
                                {t("whatsapp")}
                            </h3>
                            <p className="text-muted-foreground">
                                {t("phoneNumber")}
                            </p>
                        </div>
                    </a>

                    {/* Address */}
                    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 sm:col-span-2">
                        <div className="rounded-lg bg-primary/10 p-3">
                            <svg
                                className="h-6 w-6 text-primary"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-card-foreground">
                                {t("address")}
                            </h3>
                            <p className="text-muted-foreground">
                                {t("addressText")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
