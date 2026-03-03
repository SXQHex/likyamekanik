'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/lib/navigation';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { type Locale } from '@/lib/locales';

interface Post {
    title: string;
    description: string;
    date: string;
    category: string[];
    tags: string[];
    coverImage?: string;
    url: string;
}

interface BlogPageClientProps {
    locale: Locale;
    allPosts: Post[];
    categories: string[];
    tags: string[];
    translations: {
        searchPlaceholder: string;
        filterClear: string;
        resultsCount: string;
        emptyTitle: string;
        emptyDescription: string;
        sidebarCategories: string;
        sidebarTags: string;
    };
}

function FilterBadge({ label }: { label: string }) {
    return (
        <span className="inline-flex items-center bg-primary/10 text-primary text-xs font-bold uppercase px-2.5 py-1 rounded-full border border-primary/20">
            {label}
        </span>
    );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-muted-foreground/60">
                {title}
            </h3>
            {children}
        </section>
    );
}

function BlogContent({ locale, allPosts, categories, tags, translations }: BlogPageClientProps) {
    const searchParams = useSearchParams();
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    const filteredPosts = allPosts.filter((post) => {
        if (q) {
            const query = q.toLowerCase().trim();
            const match =
                post.title.toLowerCase().includes(query) ||
                post.description.toLowerCase().includes(query) ||
                post.tags?.some((t) => t.toLowerCase().includes(query));
            if (!match) return false;
        }
        if (category && !post.category?.includes(category)) return false;
        if (tag && !post.tags?.includes(tag)) return false;
        return true;
    });

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* İÇERİK ALANI */}
            <div className="flex-1 min-w-0">
                <div className="mb-6">
                    <BlogSearch placeholder={translations.searchPlaceholder} defaultValue={q || ''} />
                </div>

                {/* Aktif Filtre Rozetleri */}
                {(q || category || tag) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {q && <FilterBadge label={`"${q}"`} />}
                        {category && <FilterBadge label={category} />}
                        {tag && <FilterBadge label={`#${tag}`} />}
                        <Link
                            href="/blog"
                            className="text-[10px] font-bold capitalize px-3 py-1 bg-muted hover:bg-border rounded-full transition-colors"
                        >
                            {translations.filterClear}
                        </Link>
                    </div>
                )}

                <p className="text-sm text-muted-foreground mb-6">
                    {translations.resultsCount.replace('{count}', filteredPosts.length.toString())}
                </p>

                {filteredPosts.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredPosts.map((post) => (
                            <BlogCard key={post.url} post={post} locale={locale} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
                        <p className="text-xl font-black uppercase tracking-tighter text-muted-foreground/20">
                            {translations.emptyTitle}
                        </p>
                        <p className="text-sm text-muted-foreground">{translations.emptyDescription}</p>
                    </div>
                )}
            </div>

            {/* SAĞ PANEL (SIDEBAR) */}
            <aside className="w-full lg:w-40 shrink-0 space-y-8">
                <SidebarSection title={translations.sidebarCategories}>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                href={`/blog?category=${encodeURIComponent(cat)}`}
                                className={`block capitalize text-sm py-1.5 px-3 rounded-lg transition-colors ${category === cat ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                    }`}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </SidebarSection>

                <SidebarSection title={translations.sidebarTags}>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((t_) => (
                            <Link
                                key={t_}
                                href={`/blog?tag=${encodeURIComponent(t_)}`}
                                className={`text-[10px] font-bold uppercase border px-2 py-1 rounded-md transition-all ${tag === t_ ? 'bg-primary text-primary-foreground border-primary' : 'hover:border-primary'
                                    }`}
                            >
                                #{t_}
                            </Link>
                        ))}
                    </div>
                </SidebarSection>
            </aside>
        </div>
    );
}

export function BlogPageClient(props: BlogPageClientProps) {
    return (
        <Suspense fallback={<div className="opacity-50">Loading...</div>}>
            <BlogContent {...props} />
        </Suspense>
    );
}
