"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@/lib/navigation";
import { services } from "@/lib/services";

interface ExpandableCardProps {
    slug: string;
    title: string;
    description: string;
    featured?: boolean;
    labels: {
        seeDetails: string;
        goToPage: string;
        close: string;
    };
}

export function ExpandableCard({
    slug,
    title,
    description,
    featured = false,
    labels,
}: ExpandableCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Icon — services.ts'den slug ile çözümlenir
    const service = services.find((s) => s.id === slug);
    const Icon = service?.icon;

    const truncated = description.length > 100
        ? description.substring(0, 100) + "..."
        : description;

    // Desktop: dışarı tıklayınca kapat
    useEffect(() => {
        if (!isExpanded) return;
        const handleOutside = (e: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
                setIsExpanded(false);
            }
        };
        const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && setIsExpanded(false);
        document.addEventListener("mousedown", handleOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [isExpanded]);

    return (
        <motion.div
            ref={cardRef}
            layout
            transition={{ layout: { type: "spring", stiffness: 70, damping: 20 } }}
            className={isExpanded ? "relative z-40" : "relative z-10"}
        >
            <div
                onClick={() => !isExpanded && setIsExpanded(true)}
                className={`card-base cursor-pointer transition-all duration-300
                    ${featured ? "p-10 md:flex md:items-center md:gap-10" : "p-8"}
                    ${isExpanded
                        ? "border-primary/40 scale-[1.02] shadow-2xl"
                        : "hover:bg-muted/40 hover:border-primary/20"
                    }`}
            >
                {/* Featured: sol dekoratif ikon alanı */}
                {featured && Icon && (
                    <div className="hidden md:flex shrink-0 w-48 h-48 items-center justify-center rounded-2xl bg-primary/5 border border-primary/10">
                        <Icon className="h-20 w-20 text-primary/30" />
                    </div>
                )}

                <div className="relative z-10 flex-1 space-y-4">

                    {/* Üst: bar + ikon */}
                    <div className="flex items-center justify-between">
                        <motion.div
                            layout
                            className="h-0.5 bg-primary rounded-full transition-all duration-500"
                            style={{ width: isExpanded ? 60 : 28 }}
                        />
                        {Icon && (
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300
                                ${isExpanded
                                    ? "bg-primary/20 border-primary/30 text-primary"
                                    : "bg-primary/10 border-primary/20 text-primary"
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>
                        )}
                    </div>

                    {/* Başlık */}
                    <motion.h3
                        layout="position"
                        className={`font-black text-foreground uppercase tracking-tighter leading-tight
                            ${featured ? "text-2xl" : "text-lg"}`}
                    >
                        {title}
                    </motion.h3>

                    {/* Açıklama */}
                    <motion.p layout className="text-sm text-muted-foreground leading-relaxed font-medium">
                        {isExpanded ? description : truncated}
                    </motion.p>

                    {/* Kapalı hint */}
                    {!isExpanded && (
                        <div className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">
                            {labels.seeDetails}
                        </div>
                    )}

                    {/* Expand panel */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="pt-4 border-t border-border"
                            >
                                <Link
                                    href={{ pathname: "/hizmetler/[slug]", params: { slug } }}
                                    className="flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-primary-foreground transition-all hover:brightness-110"
                                >
                                    {labels.goToPage}
                                </Link>

                                {/* Kapat — sadece mobil */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                                    className="md:hidden w-full mt-3 py-2 text-[10px] text-muted-foreground hover:text-primary transition-colors uppercase font-black tracking-[0.3em]"
                                >
                                    {labels.close}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}   