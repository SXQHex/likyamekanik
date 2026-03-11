"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@/lib/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { services } from "@/lib/services";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ServiceListCardProps {
    slug: string;
    baseSlug: string;
    title: string;
    description: string;
    index: number;
}

export function ServiceListCard({
    slug,
    baseSlug,
    title,
    description,
    index,
}: ServiceListCardProps) {
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const isReversed = index % 2 !== 0;

    const service = services.find((s) => s.id === baseSlug);
    const Icon = service?.icon;
    const image = service?.image;
    const imagePosition = service?.imagePosition ?? "object-center";

    const close = useCallback(() => setIsOpen(false), []);

    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && close();
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, close]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    return (
        <>
            {/* ── KART ─────────────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={cn(
                    "group card-base overflow-hidden cursor-pointer",
                    "flex flex-col md:flex-row md:h-56",
                    isReversed && "md:flex-row-reverse"
                )}
                onClick={() => setIsOpen(true)}
            >
                {/* Resim */}
                <div className="relative w-full md:w-2/5 shrink-0 overflow-hidden min-h-48 md:min-h-0">
                    {image ? (
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className={cn("object-cover group-hover:scale-110 transition-transform duration-700", imagePosition)}
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
                            {Icon && <Icon className="h-16 w-16 text-primary/20" />}
                        </div>
                    )}
                    {/* Mobil: alttan yumuşak geçiş */}
                    <div className="absolute inset-0 bg-linear-to-t from-card via-card/50 to-transparent md:hidden" />
                    {/* Desktop: yandan yumuşak geçiş */}
                    <div className={cn(
                        "absolute inset-0 hidden md:block",
                        isReversed
                            ? "bg-linear-to-r from-card via-card/70 to-transparent"
                            : "bg-linear-to-l from-card via-card/70 to-transparent"
                    )} />
                </div>

                {/* İçerik */}
                <div className="flex flex-1 flex-col justify-center gap-4 p-8">
                    {/* Numara + ikon */}
                    <div className="flex items-center gap-5">
                        {Icon && (
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary/20 group-hover:border-primary/30 group-hover:scale-110 transition-all duration-300">
                                <Icon className="h-5 w-5" />
                            </div>
                        )}
                        {/* Başlık */}
                        <h3 className="font-black text-foreground uppercase tracking-tighter leading-tight text-2xl">
                            {title}
                        </h3>
                    </div>
                    {/* Açıklama — kısa */}
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium line-clamp-2">
                        {description}
                    </p>

                    {/* Hint */}
                    <div className="flex items-center gap-2 text-[10px] text-primary font-black uppercase tracking-[0.2em] group-hover:gap-3 transition-all duration-300">
                        <span>{t("viewDetails")}</span>
                        <span className="h-px flex-1 max-w-8 bg-primary/40 group-hover:max-w-16 transition-all duration-500" />
                    </div>
                </div>
            </motion.div>

            {/* ── MODAL ────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                            onClick={close}
                        />

                        {/* Panel */}
                        <motion.div
                            key="panel"
                            initial={{ opacity: 0, y: "100%" }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className={cn(
                                "fixed z-50 bg-card border border-border overflow-hidden",
                                "bottom-0 left-0 right-0 rounded-t-2xl",
                                "md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:rounded-2xl"
                            )}
                        >
                            {/* Resim */}
                            {image && (
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image
                                        src={image}
                                        alt={title}
                                        fill
                                        className={cn("object-cover brightness-75", imagePosition)}
                                        sizes="512px"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-card via-card/40 to-transparent" />
                                    <button
                                        onClick={close}
                                        className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 border border-white/20 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {/* İçerik */}
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    {Icon && (
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                    )}
                                    <h2 className="font-black text-foreground uppercase tracking-tighter leading-tight text-xl">
                                        {title}
                                    </h2>
                                </div>

                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                    {description}
                                </p>

                                <div className="pt-2 space-y-2">
                                    <Link
                                        href={{ pathname: "/hizmetler/[slug]", params: { slug } }}
                                        onClick={close}
                                        className="flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-primary-foreground transition-all hover:brightness-110"
                                    >
                                        {t("viewDetails")}
                                    </Link>
                                    <button
                                        onClick={close}
                                        className="md:hidden w-full py-2 text-[10px] text-muted-foreground hover:text-primary transition-colors uppercase font-black tracking-[0.3em]"
                                    >
                                        {t("close")}
                                    </button>
                                </div>
                            </div>

                            <div className="h-safe-bottom md:hidden" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}