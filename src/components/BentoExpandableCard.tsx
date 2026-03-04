"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@/lib/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { services } from "@/lib/services";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface BentoExpandableCardProps {
    slug: string;
    title: string;
    description: string;
    className?: string;
    imageClassName?: string;
}

export function BentoExpandableCard({
    slug,
    title,
    description,
    className,
    imageClassName,
}: BentoExpandableCardProps) {
    const t = useTranslations();

    const [isOpen, setIsOpen] = useState(false);

    const service = services.find((s) => s.slug === slug);
    const Icon = service?.icon;
    const image = service?.image;

    const close = useCallback(() => setIsOpen(false), []);

    // Escape
    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && close();
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, close]);

    // Body scroll lock
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    return (
        <>
            {/* ── KART ─────────────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={cn("relative overflow-hidden rounded-2xl cursor-pointer group", className)}
                onClick={() => setIsOpen(true)}
            >
                {/* Resim */}
                {image && (
                    <div className="absolute inset-0">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className={cn(
                                "object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700",
                                imageClassName
                            )}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                    </div>
                )}

                {/* İçerik */}
                <div className="relative z-10 flex flex-col justify-end h-full p-8 min-h-48 transition-transform duration-500 group-hover:-translate-y-1">
                    {Icon && (
                        <div className="mb-4 w-fit p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-500">
                            <Icon className="h-5 w-5" />
                        </div>
                    )}
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-lg mb-2">
                        {title}
                    </h3>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                        {t("viewDetails")}
                    </p>
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

                        {/* Panel — desktop: centered, mobile: bottom sheet */}
                        <motion.div
                            key="panel"
                            initial={{ opacity: 0, y: "100%" }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className={cn(
                                "fixed z-50 bg-card border border-border overflow-hidden",
                                // Mobile: bottom sheet
                                "bottom-0 left-0 right-0 rounded-t-2xl",
                                // Desktop: centered modal
                                "md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:rounded-2xl"
                            )}
                        >
                            {/* Modal — resim */}
                            {image && (
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image
                                        src={image}
                                        alt={title}
                                        fill
                                        className="object-cover brightness-75"
                                        sizes="512px"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-card via-card/40 to-transparent" />

                                    {/* Kapat butonu */}
                                    <button
                                        onClick={close}
                                        className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 border border-white/20 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {/* Modal — içerik */}
                            <div className="p-6 space-y-4">
                                {/* Başlık + ikon */}
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

                                {/* Açıklama */}
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                    {description}
                                </p>

                                {/* CTA */}
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
                                        className="w-full py-2 text-[10px] text-muted-foreground hover:text-primary transition-colors uppercase font-black tracking-[0.3em]"
                                    >
                                        {t("close")}
                                    </button>
                                </div>
                            </div>

                            {/* Mobile: safe area */}
                            <div className="h-safe-bottom md:hidden" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}