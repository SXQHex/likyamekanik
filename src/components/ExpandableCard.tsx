"use client";

import { useState } from "react";
import Link from "next/link";

interface ExpandableCardProps {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    readingTime: string;
    locale: string;
    readMoreLabel: string;
}

export function ExpandableCard({
    slug,
    title,
    excerpt,
    date,
    category,
    readingTime,
    locale,
    readMoreLabel,
}: ExpandableCardProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className={`group flex flex-col rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 ${expanded ? "ring-2 ring-primary/20" : ""
                }`}
        >
            {/* Clickable header */}
            <button
                onClick={() => setExpanded((prev) => !prev)}
                className="flex w-full items-start justify-between p-6 text-left"
            >
                <div className="flex-1">
                    {/* Category + Date */}
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">
                            {category}
                        </span>
                        <span>{date}</span>
                        <span>·</span>
                        <span>{readingTime}</span>
                    </div>

                    <h3 className="text-lg font-bold text-card-foreground transition-colors group-hover:text-primary">
                        {title}
                    </h3>
                </div>

                {/* Chevron */}
                <svg
                    className={`ml-3 mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""
                        }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Expandable content */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="border-t border-border px-6 pb-6 pt-4">
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                        {excerpt}
                    </p>
                    <Link
                        href={`/${locale}/blog/${slug}`}
                        className="inline-flex items-center text-sm font-semibold text-primary transition-transform hover:translate-x-1"
                    >
                        {readMoreLabel}
                        <svg
                            className="ml-1 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
