'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { Link } from '@/lib/navigation';
import type { ComponentProps } from 'react';
import type { Locale } from '@/lib/locales';
import { getPostsByLocale} from '@/lib/blog';

type Post = Awaited<ReturnType<typeof getPostsByLocale>>[number];

interface BlogClientViewProps {
  allPosts: Post[];
  categories: string[];
  tags: string[];
  locale: Locale;
}

export function BlogClientView({ allPosts, categories, tags, locale }: BlogClientViewProps) {
  const t = useTranslations('blog');
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const tag = searchParams.get('tag') ?? undefined;

  const filteredPosts = useMemo(() =>
    allPosts.filter((post) => {
      const { title, description, tags: postTags = [], category: postCategories = [] } = post;
 
      if (q) {
        const query = q.toLowerCase().trim();
        const match =
          title.toLowerCase().includes(query) ||
          (description ?? '').toLowerCase().includes(query) ||
          postTags.some((t: string) => t.toLowerCase().includes(query));
        if (!match) return false;
      }

      if (category && !postCategories.includes(category)) return false;
      if (tag && !postTags.includes(tag)) return false;

      return true;
    }),
    [allPosts, q, category, tag]
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <BlogSearch placeholder={t("search.placeholder")} defaultValue={q} />
          </div>

          {(q || category || tag) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {q && <FilterBadge label={`"${q}"`} />}
              {category && <FilterBadge label={category} />}
              {tag && <FilterBadge label={`#${tag}`} />}
              <Link
                href="/blog"
                className="text-[10px] font-bold uppercase px-3 py-1 bg-muted hover:bg-border rounded-full transition-colors"
              >
                {t("filter.clear")}
              </Link>
            </div>
          )}

          <p className="text-sm text-muted-foreground mb-6">
            {t("results.count", { count: filteredPosts.length })}
          </p>

          {filteredPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredPosts.map((post) => {
                const slug = post.info.path.split('/')[1]?.replace('.mdx', '');
                const postUrl = `/${locale}/blog/${slug}`;

                return (
                  <BlogCard key={postUrl} post={{ ...post, url: postUrl }} locale={locale} />
                );
              })}
            </div>
          ) : (
            <EmptyState title={t("empty.title")} description={t("empty.description")} />
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          <SidebarSection title={t("sidebar.categories")}>
            <div className="space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={(`/blog?category=${encodeURIComponent(cat)}` as ComponentProps<typeof Link>['href'])}
                  className={`block text-sm py-1.5 px-3 rounded-lg transition-colors ${
                    category === cat ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </SidebarSection>

          <SidebarSection title={t("sidebar.tags")}>
            <div className="flex flex-wrap gap-2">
              {tags.map((t_) => (
                <Link
                  key={t_}
                  href={(`/blog?tag=${encodeURIComponent(t_)}` as ComponentProps<typeof Link>['href'])}
                  className={`text-[10px] font-bold uppercase border px-2 py-1 rounded-md transition-all ${
                    tag === t_ ? 'bg-primary text-primary-foreground border-primary' : 'hover:border-primary'
                  }`}
                >
                  #{t_}
                </Link>
              ))}
            </div>
          </SidebarSection>
        </aside>
      </div>
    </div>
  );
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

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
      <p className="text-xl font-black uppercase tracking-tighter text-muted-foreground/20">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}