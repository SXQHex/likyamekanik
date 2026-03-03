import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/lib/navigation";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/lib/locales";
import { services } from "@/lib/services";
import { getServiceMetadata } from "@/lib/metadata";
import { CTAButton } from "@/components/CTAButton";
import { PageHeader } from "@/components/ui/PageHeader";
import { ServiceFAQ } from "@/components/ServiceFAQ";
import {
    Ruler, PenTool, Cog, Activity,
    Thermometer, ShieldCheck, Wrench,
    Home, Building2, Sun,
} from "lucide-react";


// Icon mapping for dynamic features
const FEATURE_ICONS: Record<string, any> = {
    f1: Thermometer,
    f2: Cog,
    f3: Activity,
    f4: ShieldCheck,
    f5: Wrench,
    f6: PenTool,
    f7: ShieldCheck
};

const PROCESS_ICONS: Record<string, any> = {
    step1: Ruler,
    step2: PenTool,
    step3: Cog,
    step4: Activity
};

export function generateStaticParams() {
    return locales.flatMap((locale) =>
        services.map((s) => ({ locale, slug: s.slug })),
    );
}

export const generateMetadata = ({ params }: { params: Promise<{ locale: Locale; slug: string }> }) =>
    getServiceMetadata(params);

export default async function ServiceDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const service = services.find((s) => s.slug === slug);
    if (!service) notFound();

    const t = await getTranslations();
    const serviceKey = `services.items.${slug}`;

    // Basic Data
    const title = t(`${serviceKey}.title`);
    const description = t(`${serviceKey}.description`);
    const headerSubtitle = t.has(`${serviceKey}.header.description`) ? t(`${serviceKey}.header.description`) : description;
    const headerEyebrow = t.has(`${serviceKey}.header.eyebrow`) ? t(`${serviceKey}.header.eyebrow`) : t("services.title");

    // Rich Content Checks
    const hasVision = t.has(`${serviceKey}.vision.title`);
    const hasProcess = t.has(`${serviceKey}.process.title`);
    const hasSolutions = t.has(`${serviceKey}.solutions.mainTitle`);
    const hasFaq = t.has(`${serviceKey}.faq.title`);

    // Features could be array (legacy) or object (rich)
    const rawFeatures = t.raw(`${serviceKey}.features`);
    const isRichFeatures = !Array.isArray(rawFeatures);

    if (!title) notFound();

    // --- RICH LAYOUT RENDER ---

    return (
        <>
            <section className="min-h-screen bg-background text-foreground selection:bg-primary/30">
                <PageHeader
                    title={title}
                    description={headerSubtitle}
                    image={service.image}
                    imagePosition={service.imagePosition}
                    eyebrow={headerEyebrow}
                    backLinkHref="/hizmetler"
                    backLinkLabel={t("serviceDetail.backToServices")}
                />

                <div className="container mx-auto px-4 py-8 md:py-8">
                    {/* VISUAL & VISION SECTION */}
                    {hasVision && (
                        <div className="mb-16 flex flex-col items-center gap-8 lg:flex-row">
                            <div className="w-full lg:w-3/5">
                                <div className="inline-block px-3 py-1 mb-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                                    {t(`${serviceKey}.vision.badge`)}
                                </div>
                                <h2 className="mb-4 text-3xl lg:text-4xl font-black text-primary/80 uppercase tracking-tighter leading-tight">
                                    {t.rich(`${serviceKey}.vision.title`, {
                                        br: () => <br />,
                                        span: (chunks) => <span className="text-primary">{chunks}</span>
                                    })} <br />
                                    <span className="text-primary">{t(`${serviceKey}.vision.titleHighlight`)}</span>
                                </h2>
                                <p className="mb-6 text-base text-muted-foreground leading-relaxed font-medium">
                                    {t.rich(`${serviceKey}.vision.description`, {
                                        span: (chunks) => <span className="text-primary">{chunks}</span>
                                    })}
                                </p>

                                {isRichFeatures && (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {Object.keys(rawFeatures).map((key) => {
                                            const Icon = FEATURE_ICONS[key] || Activity;
                                            return (
                                                <div key={key} className="card-base flex items-start gap-3 p-3">
                                                    <Icon className="mt-1 h-5 w-5 text-primary shrink-0" />
                                                    <div>
                                                        <div className="font-bold text-foreground text-lg uppercase tracking-tight leading-tight">
                                                            {t(`${serviceKey}.features.${key}.title`)}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground leading-snug mt-1">
                                                            {t.rich(`${serviceKey}.features.${key}.desc`, {
                                                                br: () => <br />,
                                                                span: (chunks) => <span className="text-primary">{chunks}</span>
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="relative aspect-video lg:aspect-3/4 w-full lg:w-2/5 overflow-hidden rounded-3xl shadow-xl group border border-border">
                                <Image
                                    src={service.image1 || service.image || ""}
                                    alt={title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                    priority
                                />
                                <div className="absolute bottom-4 left-4 z-20 bg-card/90 backdrop-blur-md p-3 rounded-xl border border-border shadow-lg max-w-40">
                                    <div className="text-2xl font-black text-primary leading-none">%35+</div>
                                    <div className="text-xs font-bold uppercase mt-1 leading-tight">
                                        {t(`${serviceKey}.vision.stats`)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SOLUTIONS SECTION */}
                    {hasSolutions && (
                        <div className="mb-16">
                            <div className="flex flex-col md:flex-row justify-between items-baseline mb-6 border-b pb-4">
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">
                                    {t.rich(`${serviceKey}.solutions.mainTitle`)} <span className="text-primary">{t(`${serviceKey}.solutions.mainHighlight`)}</span>
                                </h2>
                                <p className="text-muted-foreground font-medium text-xs uppercase tracking-widest mt-1">
                                    {t(`${serviceKey}.solutions.description`)}
                                </p>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Commercial */}
                                <div className="card-base p-6 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20"><Home className="h-5 w-5" /></div>
                                        <h3 className="text-lg font-extrabold uppercase text-foreground leading-tight">{t(`${serviceKey}.solutions.individual.title`)}</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                        {t.rich(`${serviceKey}.solutions.individual.desc`, {
                                            strong: (chunks) => <strong>{chunks}</strong>
                                        })}
                                    </p>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className="inline-flex items-center gap-1 py-1 px-2 rounded-md bg-secondary text-xs font-bold uppercase border">
                                            <Sun className="h-3 w-3 text-orange-500" /> {t(`${serviceKey}.solutions.individual.tag1`)}
                                        </span>
                                        <span className="inline-flex items-center gap-1 py-1 px-2 rounded-md bg-secondary text-xs font-bold uppercase border">
                                            {t(`${serviceKey}.solutions.individual.tag2`)}
                                        </span>
                                    </div>
                                </div>

                                {/* Commercial */}
                                <div className="card-base p-6 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20"><Building2 className="h-5 w-5" /></div>
                                        <h3 className="text-lg font-extrabold uppercase text-foreground leading-tight">{t(`${serviceKey}.solutions.commercial.title`)}</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                        {t.rich(`${serviceKey}.solutions.commercial.desc`, {
                                            strong: (chunks) => <strong>{chunks}</strong>
                                        })}
                                    </p>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className="inline-flex items-center gap-1 py-1 px-2 rounded-md bg-secondary text-xs font-bold uppercase border">
                                            <ShieldCheck className="h-3 w-3 text-green-600" /> {t(`${serviceKey}.solutions.commercial.tag1`)}
                                        </span>
                                        <span className="inline-flex items-center gap-1 py-1 px-2 rounded-md bg-secondary text-xs font-bold uppercase border">
                                            {t(`${serviceKey}.solutions.commercial.tag2`)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PROCESS SECTION */}
                    {hasProcess && (
                        <div className="mb-16 card-base bg-brand-dark p-8 md:p-12 text-foreground border border-white/5">
                            <h2 className="mb-8 text-center text-2xl font-black uppercase tracking-tighter text-foreground">{t(`${serviceKey}.process.title`)}</h2>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {/* Assuming 4 fixed steps for now, or we can map if key structure is consistent */}
                                {['step1', 'step2', 'step3', 'step4'].map((stepKey, idx) => {
                                    const Icon = PROCESS_ICONS[stepKey] || Activity;
                                    return (
                                        <div key={stepKey} className="relative text-center group">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:bg-primary/20 transition-all">
                                                <Icon className="h-8 w-8 text-primary" />
                                            </div>
                                            <h4 className="mb-1 font-bold uppercase text-sm tracking-widest text-foreground">{t(`${serviceKey}.process.${stepKey}.title`)}</h4>
                                            <p className="text-xs text-muted-foreground leading-relaxed px-2">{t(`${serviceKey}.process.${stepKey}.desc`)}</p>
                                            {idx < 3 && <div className="absolute right-0 top-8 hidden h-px w-full bg-linear-to-r from-primary/50 to-transparent lg:block translate-x-1/2" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* FAQ SECTION (Client Component) */}
                    {hasFaq && (
                        <ServiceFAQ
                            faqKeys={Object.keys(t.raw(`${serviceKey}.faq`)).filter(k => k !== 'title')}
                            translationKey={`${serviceKey}.faq`}
                        />
                    )}

                    {/* CTA SECTION */}
                    <div className="mt-8 card-base p-8 text-center md:p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                        <h2 className="mb-4 text-3xl font-black uppercase leading-tight tracking-tighter">{t(`${serviceKey}.cta.title`) || t("cta.title")}</h2>
                        <p className="mb-8 text-muted-foreground mx-auto max-w-xl text-base font-medium">{t(`${serviceKey}.cta.description`) || t("cta.description")}</p>
                        <a href={`https://wa.me/905446415745?text=${encodeURIComponent(title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-12 items-center justify-center rounded-xl bg-green-500 px-10 py-4 text-base shadow-primary-glow font-bold uppercase tracking-widest text-white transition-all hover:bg-green-600 active:scale-95">
                            {t(`${serviceKey}.cta.button`) || t("cta.primary")}
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}

