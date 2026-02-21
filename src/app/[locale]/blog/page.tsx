import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { getAllPosts } from "./data-access";
import { ExpandableCard } from "@/components/ExpandableCard";
import { PageHeader } from "@/components/ui/PageHeader";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();
    return {
        title: t("blog.title"),
        description: t("blog.subtitle"),
    };
}

export default async function BlogPage() {
    const locale = await getLocale();
    const t = await getTranslations();
    const posts = await getAllPosts(locale, t("blog.minRead"));

    return (
        <section className="px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-6xl">
                <PageHeader title={t("blog.title")} subtitle={t("blog.subtitle")} />

                {posts.length === 0 ? (
                    <p className="text-center text-muted-foreground">{t("blog.noPosts")}</p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
                        {posts.map((post) => (
                            <ExpandableCard
                                key={post.slug}
                                // Tıpkı eski projendeki gibi veriyi paket olarak gönderiyoruz
                                item={post}
                                // Label'ları ExpandableCard içindeki uiLabels yapısına uygun gönderiyoruz
                                labels={{
                                    readMore: t("blog.readMore"),
                                    readFullArticle: t("blog.readFullArticle"),
                                    close: t("blog.close")
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}