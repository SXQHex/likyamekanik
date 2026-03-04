import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageMetadata, type PageParams } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/PageHeader";
import { CTASection } from "@/components/CTASection";
import { ContactForm } from "@/components/ContactForm";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";

// ── Metadata ─────────────────────────────────────────────────────────────────
export const generateMetadata = ({ params }: { params: PageParams }): Promise<Metadata> =>
    getPageMetadata({ params, section: "/iletisim", namespace: "contact" });

// ── Veri ─────────────────────────────────────────────────────────────────────
const SERVICE_AREAS = [
    "Fethiye", "Ölüdeniz", "Göcek", "Dalaman",
    "Ortaca", "Dalyan", "Kaş", "Seydikemer",
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function ContactPage({
    params,
}: {
    params: PageParams;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "contact" });

    const waMessages: Record<string, string> = {
        tr: "İletişim sayfasından ulaşıyorum.",
        en: "I'm reaching out from the Contact page.",
        ru: "Пишу со страницы контактов.",
        uk: "Пишу зі сторінки контактів.",
    };

    return (
        <>
            {/* ── 1. PAGE HEADER ─────────────────────────────────────────── */}
            <PageHeader
                eyebrow={t("eyebrow")}
                title={t("title")}
                description={t("description")}
            />

            <div className="container mx-auto px-4 py-8 md:py-8">

                {/* ── 2. İLETİŞİM KARTLARI + FORM ───────────────────────── */}
                <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_1.6fr]">

                    {/* Sol: İletişim Bilgileri */}
                    <div className="flex flex-col gap-4">

                        {/* Telefon */}
                        <a
                            href="tel:+905446415745"
                            className="card-base flex items-center gap-4 p-6 hover:bg-muted/40 transition-colors group"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                                    {t("phone")}
                                </p>
                                <p className="font-black text-foreground tracking-tight">
                                    +90 544 641 5745
                                </p>
                            </div>
                        </a>

                        {/* WhatsApp */}
                        <a
                            href={`https://wa.me/905446415745?text=${encodeURIComponent(waMessages[locale] ?? waMessages.tr)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card-base flex items-center gap-4 p-6 hover:bg-muted/40 transition-colors group"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 group-hover:scale-110 transition-transform">
                                <MessageCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                                    {t("whatsapp")}
                                </p>
                                <p className="font-black text-foreground tracking-tight">
                                    +90 544 641 5745
                                </p>
                            </div>
                        </a>

                        {/* E-posta */}
                        <a
                            href="mailto:info@likyamekanik.com"
                            className="card-base flex items-center gap-4 p-6 hover:bg-muted/40 transition-colors group"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                                    {t("email")}
                                </p>
                                <p className="font-black text-foreground tracking-tight">
                                    info@likyamekanik.com
                                </p>
                            </div>
                        </a>

                        {/* Adres */}
                        <a
                            href="https://maps.google.com/?q=Fethiye,+Muğla,+Türkiye"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card-base flex items-center gap-4 p-6 hover:bg-muted/40 transition-colors group"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                                    {t("address")}
                                </p>
                                <p className="font-black text-foreground tracking-tight">
                                    {t("addressText")}
                                </p>
                            </div>
                        </a>
                    </div>

                    {/* Sağ: Form */}
                    <div className="card-base p-8">
                        <div className="mb-6">
                            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20 mb-3">
                                {t("formBadge")}
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">
                                {t("formTitle")}
                            </h2>
                        </div>
                        <ContactForm
                            labels={{
                                name: t("form.name"),
                                phone: t("form.phone"),
                                message: t("form.message"),
                                submit: t("form.submit"),
                                success: t("form.success"),
                                error: t("form.error"),
                            }}
                            whatsappMessage={waMessages[locale] ?? waMessages.tr}
                        />
                    </div>
                </div>

                {/* ── 3. HİZMET BÖLGESİ ──────────────────────────────────── */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-baseline px-0 py-5 border-b border-border mb-6">
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">
                            {t("serviceAreaTitle")}
                        </h2>
                        <p className="text-muted-foreground font-medium text-xs uppercase tracking-widest mt-1">
                            {t("serviceAreaSubtitle")}
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">


                        {/* Harita */}
                        <div className="overflow-hidden rounded-xl border border-border aspect-video lg:aspect-auto lg:min-h-80">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d386000!2d28.8!3d36.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1str!2str!4v1"
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: "320px" }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={t("serviceAreaTitle")}
                            />
                        </div>

                        {/* İlçe Listesi */}
                        <div className="card-base p-6">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                                {t("serviceAreaList")}
                            </p>
                            <ul className="grid grid-cols-2 gap-px bg-border border border-border">
                                {SERVICE_AREAS.map((area) => (
                                    <li
                                        key={area}
                                        className="bg-background px-4 py-3 text-sm font-semibold text-foreground uppercase tracking-tight"
                                    >
                                        {area}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>

            {/* ── 4. CTA ─────────────────────────────────────────────────── */}
            <CTASection
                title={t("cta.title")}
                description={t("cta.description")}
                button={t("cta.button")}
                whatsappMessage={waMessages[locale] ?? waMessages.tr}
            />
        </>
    );
}