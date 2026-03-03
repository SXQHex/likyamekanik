'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link, useRouter } from '@/lib/navigation';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { type Locale } from '@/lib/locales';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

interface Post {
    title: string;
    description: string;
    date: string;
    category: string[];
    tags: string[];
    coverImage?: string;
    url: { pathname: '/blog/[slug]'; params: { slug: string } };
}

interface BlogPageClientProps {
    locale: Locale;
    allPosts: Post[];
    categories: string[];
    tags: string[];
}

function FilterBadge({ label, onRemove }: { label: string; onRemove?: () => void }) {
    return (
        <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold uppercase pl-2.5 pr-1.5 py-1 rounded-full border border-primary/20 transition-colors group hover:bg-primary/15">
            {label}
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="p-0.5 rounded-full hover:bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 text-primary/70 hover:text-primary"
                    aria-label={`Remove ${label} filter`}
                >
                    <X size={12} strokeWidth={3} />
                </button>
            )}
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

function BlogContent({ locale, allPosts, categories, tags }: BlogPageClientProps) {
    const router = useRouter();
    const t = useTranslations('blog');
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

    const buildQuery = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([k, v]) => {
            if (v === null) {
                params.delete(k);
            } else {
                params.set(k, v);
            }
        });
        const qObj: Record<string, string> = {};
        params.forEach((v, k) => { qObj[k] = v; });
        return qObj;
    };

    const removeFilter = (key: string) => {
        const newQuery = buildQuery({ [key]: null });
        // Handle router push for removal
        if (Object.keys(newQuery).length > 0) {
            router.push({ pathname: '/blog', query: newQuery as any });
        } else {
            router.push('/blog');
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* İÇERİK ALANI */}
            <div className="flex-1 min-w-0">
                <div className="mb-6">
                    <BlogSearch placeholder={t('search.placeholder')} defaultValue={q || ''} />
                </div>

                {/* Aktif Filtre Rozetleri */}
                {(q || category || tag) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {q && <FilterBadge label={`"${q}"`} onRemove={() => removeFilter('q')} />}
                        {category && <FilterBadge label={category} onRemove={() => removeFilter('category')} />}
                        {tag && <FilterBadge label={`#${tag}`} onRemove={() => removeFilter('tag')} />}
                        <Link
                            href="/blog"
                            className="text-[10px] font-bold capitalize px-3 py-1 bg-muted hover:bg-border rounded-full transition-colors"
                        >
                            {t('filter.clear')}
                        </Link>
                    </div>
                )}

                <p className="text-sm text-muted-foreground mb-6">
                    {t(filteredPosts.length === 1 ? 'results.count' : 'results.countPlural', { count: filteredPosts.length })}
                </p>

                {filteredPosts.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredPosts.map((post) => (
                            <BlogCard key={post.url.params.slug} post={post} locale={locale} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
                        <p className="text-xl font-black uppercase tracking-tighter text-muted-foreground/20">
                            {t('empty.title')}
                        </p>
                        <p className="text-sm text-muted-foreground">{t('empty.description')}</p>
                    </div>
                )}
            </div>

            {/* SAĞ PANEL (SIDEBAR) */}
            <aside className="w-full lg:w-40 shrink-0 space-y-8">
                <SidebarSection title={t('sidebar.categories')}>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                href={{ pathname: '/blog', query: buildQuery({ category: category === cat ? null : cat }) as any }}
                                className={`block capitalize text-sm py-1.5 px-3 rounded-lg transition-colors ${category === cat ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                    }`}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </SidebarSection>

                <SidebarSection title={t('sidebar.tags')}>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((t_) => (
                            <Link
                                key={t_}
                                href={{ pathname: '/blog', query: buildQuery({ tag: tag === t_ ? null : t_ }) as any }}
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
