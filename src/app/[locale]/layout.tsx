import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getTranslation, locales } from "@/lib/i18n";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = getTranslation(locale);

    return {
        title: {
            template: "%s | Likya Mekanik",
            default: t.meta.siteTitle,
        },
        description: t.meta.siteDescription,
        openGraph: {
            title: t.meta.siteTitle,
            description: t.meta.siteDescription,
            type: "website",
            locale: locale === "tr" ? "tr_TR" : "en_US",
            siteName: "Likya Mekanik",
        },
        alternates: {
            languages: {
                tr: "/tr",
                en: "/en",
            },
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <html lang={locale} suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
            >
                <ThemeProvider>
                    <div className="flex min-h-screen flex-col">
                        <Header locale={locale} />
                        <main className="flex-1">{children}</main>
                        <Footer locale={locale} />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
