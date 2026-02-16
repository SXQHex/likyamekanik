import type { Metadata } from "next";
import { getTranslation } from "@/lib/i18n";
import { getAllPosts } from "./data-access";
import { ExpandableCard } from "@/components/ExpandableCard";
import { PageHeader } from "@/components/ui/PageHeader";

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
    const posts = await getAllPosts(locale, t.blog.minRead);

    return (
        <section className="px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-6xl">
                <PageHeader title={t.blog.title} subtitle={t.blog.subtitle} />

                {posts.length === 0 ? (
                    <p className="text-center text-muted-foreground">{t.blog.noPosts}</p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <ExpandableCard
                                key={post.slug}
                                slug={post.slug}
                                title={post.title}
                                excerpt={post.excerpt}
                                date={post.date}
                                category={post.category}
                                readingTime={post.readingTime}
                                locale={locale}
                                readMoreLabel={t.blog.readMore}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}