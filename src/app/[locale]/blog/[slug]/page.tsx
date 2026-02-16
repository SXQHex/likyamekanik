import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslation } from "@/lib/i18n";
import { getBlogPost, getBlogPosts, markdownToHtml } from "@/lib/blog";

export function generateStaticParams() {
    const trPosts = getBlogPosts("tr");
    const enPosts = getBlogPosts("en");

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
    const post = getBlogPost(locale, slug);

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
    const post = getBlogPost(locale, slug);
    if (!post) notFound();

    const t = getTranslation(locale);
    const htmlContent = markdownToHtml(post.content);

    return (
        <article className="px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-3xl">
                <Link
                    href={`/${locale}/blog`}
                    className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    {t.blog.backToBlog}
                </Link>

                <header className="mb-10">
                    <div className="mb-3 text-sm text-muted-foreground">{post.date}</div>
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
