// src/app/[locale]/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/lib/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getPostBySlug, getAllPosts, markdownToHtml } from "../data-access";
import { Toc } from "../components/Toc";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

export async function generateStaticParams() {
    const trPosts = await getAllPosts("tr");
    const enPosts = await getAllPosts("en");
    const ruPosts = await getAllPosts("ru");
    const ukPosts = await getAllPosts("uk");


    return [
        ...trPosts.map((p) => ({ locale: "tr", slug: p.slug })),
        ...enPosts.map((p) => ({ locale: "en", slug: p.slug })),
        ...ruPosts.map((p) => ({ locale: "ru", slug: p.slug })),
        ...ukPosts.map((p) => ({ locale: "uk", slug: p.slug })),

    ];
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const locale = await getLocale();
    const post = await getPostBySlug(locale, slug);

    if (!post) return {};

    return {
        title: post.title,
        description: post.excerpt,
    };
}

export default async function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const locale = await getLocale();
    const t = await getTranslations();
    const post = await getPostBySlug(locale, slug, t("blog.minRead"));

    if (!post) notFound();

    const htmlContent = markdownToHtml(post.content);

    // Dil değiştirici için yolları hazırla
    const alternatePaths = Object.entries(post.slugs).reduce((acc, [lang, s]) => {
        if (s) acc[lang] = `/${lang}/blog/${s}`;
        return acc;
    }, {} as Record<string, string>);

    return (
        <article className="min-h-screen px-4 pt-32 pb-20 sm:px-6">

            <div className="mx-auto max-w-7xl">
                {/* Üst Kısım: Geri Dönüş ve Meta Bilgiler */}
                <div className="mb-12 flex flex-col gap-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-primary transition-all hover:-translate-x-1"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t("blog.backToBlog")}
                    </Link>

                    <header className="space-y-6">
                        <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                                {post.category}
                            </span>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readingTime}</span>
                        </div>

                        {/* H1: TOC'un en başında görünecek ana başlık */}
                        <h1 id="article-title" className="text-4xl font-black uppercase leading-tight tracking-tighter sm:text-6xl lg:max-w-4xl">
                            {post.title}
                        </h1>
                    </header>
                </div>

                {/* ANA İÇERİK VE TOC DÜZENİ */}
                <div className="flex flex-col gap-16 lg:flex-row lg:items-start">

                    {/* SOL: MDX İçeriği (Geniş alan) */}
                    <div
                        id="post-content" // TOC bu ID'yi tarar
                        className="prose prose-invert prose-primary min-w-0 flex-1 max-w-none prose-headings:uppercase prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />

                    {/* SAĞ: Sabitlenen İçindekiler (Sticky) */}
                    <aside className="sticky top-32 hidden w-64 shrink-0 lg:block">
                        <Toc label={t("blog.toc")} />
                    </aside>

                </div>
            </div>
        </article>
    );
}