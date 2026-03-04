import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageMetadata, type PageParams } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/PageHeader";
import { CTASection } from "@/components/CTASection";
import type { LucideIcon } from "lucide-react";
import {
    Ruler,
    MapPin,
    ShieldCheck,
    Users,
    Receipt,
    Zap,
} from "lucide-react";

// ── Icon map — id JSON'da, icon burada ───────────────────────────────────────
const WHY_ICONS: Record<string, LucideIcon> = {
    engineering: Ruler,
    climate: MapPin,
    material: ShieldCheck,
    continuity: Users,
    transparency: Receipt,
    efficiency: Zap,
};

// ── Metadata ─────────────────────────────────────────────────────────────────
export const generateMetadata = ({ params }: { params: PageParams }): Promise<Metadata> =>
    getPageMetadata({ params, section: "/hakkimizda", namespace: "about" });

// ── Tipler ───────────────────────────────────────────────────────────────────
interface WhyItem {
    id: string;
    label: string;
    description: string;
}

interface StatItem {
    value: string;
    label: string;
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function AboutPage({
    params,
}: {
    params: PageParams;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "about" });

    const whyItems = t.raw("why") as WhyItem[];
    const statItems = t.raw("stats") as StatItem[];

    return (
        <>
            {/* ── 1. PAGE HEADER ─────────────────────────────────────────── */}
            <PageHeader
                eyebrow={t("eyebrow")}
                title={t("title")}
                description={t("description")}
            // image="/about/hero.jpg" — fotoğraf hazır olduğunda aktif edin
            />

            <div className="container mx-auto px-4 py-8 md:py-12">

                {/* ── 2. MİSYON & VİZYON ────────────────────────────────── */}
                <div className="mb-16 grid gap-6 md:grid-cols-2">

                    {/* Misyon */}
                    <div className="card-base p-8 space-y-4">
                        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                            {t("missionBadge")}
                        </div>
                        <p className="text-base leading-relaxed text-muted-foreground font-medium">
                            {t("mission")}
                        </p>
                    </div>

                    {/* Vizyon */}
                    <div className="card-base p-8 space-y-4">
                        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                            {t("visionBadge")}
                        </div>
                        <p className="text-base leading-relaxed text-muted-foreground font-medium">
                            {t("vision")}
                        </p>
                    </div>
                </div>

                {/* ── 3. NEDEN LİKYA + 4. SAYISAL BANT ─────────────────── */}
                <div className="mb-16">

                    {/* Başlık */}
                    <div className="flex flex-col md:flex-row justify-between items-baseline px-6 py-5 border-b border-border">
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">
                            {t("whyTitle")}
                        </h2>
                        <p className="text-muted-foreground font-medium text-xs uppercase tracking-widest mt-1">
                            {t("whyDescription")}
                        </p>
                    </div>

                    {/* Kartlar */}
                    <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
                        {whyItems.map((item) => {
                            const Icon = WHY_ICONS[item.id] ?? Zap;
                            return (
                                <div
                                    key={item.id}
                                    className="bg-background flex flex-col items-center text-center p-8 md:p-10 hover:bg-muted/40 transition-all duration-300 group"
                                >
                                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                                        <Icon className="h-7 w-7" />
                                    </div>
                                    <div className="space-y-3 max-w-70">
                                        <h3 className="font-black text-foreground uppercase tracking-tighter leading-tight text-lg">
                                            {item.label}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Stats — kartların altına yapışık footer şeridi */}
                    <div className="grid grid-cols-2 md:grid-cols-4 mt-4 border-t border-border pt-6">
                        {statItems.map((stat, idx) => (
                            <div
                                key={stat.label}
                                className={`flex flex-col gap-1 px-6 py-2 ${idx !== 0 ? "border-l border-border" : ""}`}
                            >
                                <span className="text-3xl font-black text-primary leading-none tracking-tighter">
                                    {stat.value}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div> {/* container kapanıyor */}

            {/* ── 5. CTA ─────────────────────────────────────────────── */}
            <CTASection
                title={t("cta.title")}
                description={t("cta.description")}
                button={t("cta.button")}
                whatsappMessage={t("cta.whatsappMessage")}
            />
        </>
    );
}