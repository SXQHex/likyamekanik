import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslation } from "@/lib/i18n";
import { getPostBySlug, getAllPosts, markdownToHtml } from "../data-access";
import { AlternatePathSetter } from "@/components/AlternatePathSetter";

export async function generateStaticParams() {
    const trPosts = await getAllPosts("tr");
    const enPosts = await getAllPosts("en");

    return [
        ...trPosts.map((p) => ({ locale: "tr", slug: p.slug })),
        ...enPosts.map((p) => ({ locale: "en", slug: p.slug })),
    ];
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;
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
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const t = getTranslation(locale);
    const post = await getPostBySlug(locale, slug, t.blog.minRead);
    if (!post) notFound();

    const htmlContent = markdownToHtml(post.content);



    // Prepare alternate paths map for LanguageSwitcher
    const alternatePaths = Object.entries(post.slugs).reduce((acc, [lang, s]) => {
        if (s) {
            acc[lang] = `/${lang}/blog/${s}`;
        }
        return acc;
    }, {} as Record<string, string>);

    return (
        <article className="px-4 py-16 sm:px-6 sm:py-24">
            <AlternatePathSetter paths={alternatePaths} />
            <div className="mx-auto max-w-3xl">
                <Link
                    href={`/${locale}/blog`}
                    className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    {t.blog.backToBlog}
                </Link>

                <header className="mb-10">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">
                            {post.category}
                        </span>
                        <span>{post.date}</span>
                        <span>·</span>
                        <span>{post.readingTime}</span>
                    </div>
                    <h1 className="text-4xl font-bold leading-tight text-foreground">
                        {post.title}
                    </h1>
                </header>

                <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </div>
        </article>
    );
}
