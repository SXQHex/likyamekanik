"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface ServiceFAQProps {
    faqKeys: string[];
    translationKey: string;
}

export function ServiceFAQ({ faqKeys, translationKey }: ServiceFAQProps) {
    const t = useTranslations(translationKey);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (!faqKeys || faqKeys.length === 0) return null;

    return (
        <div className="py-8">
            <h2 className="mb-6 text-center text-2xl font-black uppercase tracking-tighter">
                {t("title")}
            </h2>
            <div className="mx-auto max-w-3xl divide-y divide-border border-y">
                {faqKeys.map((key, i) => (
                    <div key={key} className="py-4">
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="flex w-full items-center justify-between text-left group"
                        >
                            <span className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                                {t(`${key}.q`)}
                            </span>
                            {openIndex === i ? (
                                <ChevronUp className="h-4 w-4 text-primary" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                        </button>
                        {openIndex === i && (
                            <div className="mt-2 text-sm text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-1">
                                {t(`${key}.a`)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
