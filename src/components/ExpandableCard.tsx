"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@/lib/navigation";
import Image from "next/image";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ExpandableItem {
    slug: string;
    title?: string;
    excerpt?: string;
    image?: string;
    category?: string;
    date?: string;
    readingTime?: string;
}

interface ExpandableCardProps {
    item: ExpandableItem;
    // lang prop no longer needed for link construction, but might be passed for other reasons. Keeping signature flexible.
    labels?: Record<string, string>;
}

export function ExpandableCard({ item, labels }: ExpandableCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const uiLabels = {
        readMore: labels?.readMore ?? "Okumaya Başla →",
        readFullArticle: labels?.readFullArticle ?? "Yazının Tamamını Oku",
        close: labels?.close ?? "[ Kapat ]"
    };

    useEffect(() => {
        if (!isExpanded) return;
        const handleOutsideClick = (e: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
                setIsExpanded(false);
            }
        };
        const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && setIsExpanded(false);
        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [isExpanded]);

    if (!item) return null;

    return (
        <motion.div
            ref={cardRef}
            layout
            transition={{ layout: { type: "spring", stiffness: 100, damping: 22 } }}
            className={cn("relative transition-all duration-300", isExpanded ? "z-40" : "z-10")}
        >
            <Card
                onClick={() => !isExpanded && setIsExpanded(true)}
                className={cn(
                    "card-base cursor-pointer border-none p-0 overflow-hidden transition-all duration-500",
                    isExpanded && "scale-[1.02]"
                )}
            >
                {/* Blog Görseli - MDX dosyasındaki image alanından gelir [cite: 2, 11] */}
                <AnimatePresence>
                    {isExpanded && item?.image && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-0"
                        >
                            <Image
                                src={item.image}
                                alt={item?.title ?? "Blog Image"}
                                fill
                                className="object-cover opacity-20 grayscale brightness-[0.4]"
                            />
                            <div className="absolute inset-0 bg-linear-to-b from-card/80 via-card/90 to-card" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="mb-4 flex items-center justify-between">
                        <motion.div
                            layout
                            className="h-1 bg-primary rounded-full"
                            style={{ width: isExpanded ? '60px' : '30px' }}
                        />
                        {/* Kategori Bilgisi - Manifest ve MDX dosyasından çekilir  */}
                        {item?.category && (
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                                {item.category}
                            </span>
                        )}
                    </div>

                    <CardTitle className="text-xl font-bold uppercase leading-tight mb-4">
                        {item?.title ?? "Likya Mekanik"}
                    </CardTitle>

                    <CardContent className="p-0 flex-1">
                        <motion.p layout className="text-sm leading-relaxed text-muted-foreground italic">
                            {/* Özet metin (excerpt) her iki durumda da kullanılır  */}
                            {isExpanded
                                ? (item?.excerpt ?? "")
                                : (item?.excerpt ? item.excerpt.substring(0, 90) + "..." : "")
                            }
                        </motion.p>
                    </CardContent>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 pt-4 border-t border-border/50"
                            >
                                <Link
                                    href={{ pathname: '/blog/[slug]', params: { slug: item?.slug ?? "" } }}
                                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all flex justify-center items-center"
                                >
                                    {uiLabels.readFullArticle}
                                </Link>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                                    className="w-full mt-3 text-[10px] text-muted-foreground hover:text-primary transition-colors uppercase font-bold tracking-[0.2em]"
                                >
                                    {uiLabels.close}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isExpanded && (
                        <motion.div layout className="mt-4 text-[10px] text-primary font-bold uppercase tracking-widest">
                            {uiLabels.readMore}
                        </motion.div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}