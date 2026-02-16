import type { Metadata } from "next";
import Link from "next/link";
import { getTranslation } from "@/lib/i18n";
import { getBlogPosts } from "@/lib/blog";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = getTranslation(locale);
    return {
        title: t.blog.title,
        description: t.blog.subtitle,
    };
}

export default async function BlogPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = getTranslation(locale);
    const posts = getBlogPosts(locale);

    return (
        <section className="px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-3xl">
                <div className="mb-12 text-center">
                    <h1 className="mb-3 text-4xl font-bold text-foreground">
                        {t.blog.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">{t.blog.subtitle}</p>
                </div>

                {posts.length === 0 ? (
                    <p className="text-center text-muted-foreground">{t.blog.noPosts}</p>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/${locale}/blog/${post.slug}`}
                                className="group block rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                            >
                                <div className="mb-2 text-sm text-muted-foreground">
                                    {post.date}
                                </div>
                                <h2 className="mb-2 text-xl font-bold text-card-foreground transition-colors group-hover:text-primary">
                                    {post.title}
                                </h2>
                                <p className="mb-4 text-muted-foreground">{post.excerpt}</p>
                                <span className="inline-flex items-center text-sm font-semibold text-primary">
                                    {t.blog.readMore}
                                    <svg
                                        className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
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
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
