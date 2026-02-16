"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getTranslation } from "@/lib/i18n";

interface NavItem {
    href: string;
    label: string;
}

export function Header({ locale }: { locale: string }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const t = getTranslation(locale);

    const navItems: NavItem[] = [
        { href: `/${locale}`, label: t.nav.home },
        { href: `/${locale}/hizmetler`, label: t.nav.services },
        { href: `/${locale}/hakkimizda`, label: t.nav.about },
        { href: `/${locale}/blog`, label: t.nav.blog },
        { href: `/${locale}/iletisim`, label: t.nav.contact },
    ];

    function isActive(href: string) {
        if (href === `/${locale}`) return pathname === `/${locale}`;
        return pathname.startsWith(href);
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                {/* Logo */}
                <Link
                    href={`/${locale}`}
                    className="text-xl font-bold tracking-tight text-foreground"
                >
                    Likya Mekanik
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-1 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive(item.href)
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <LanguageSwitcher locale={locale} />
                    <ThemeToggle />

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="rounded-lg border border-border p-2 text-muted-foreground md:hidden"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            {menuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {menuOpen && (
                <nav className="border-t border-border bg-background px-4 py-3 md:hidden">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive(item.href)
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    );
}
