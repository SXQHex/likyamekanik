import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPageMetadata } from "@/lib/metadata";
import { locales, type Locale } from "@/lib/locales";
import { getPostsByLocale, buildPostUrl } from "@/lib/blog";
import { Link } from "@/lib/navigation";

// UI Bileşenleri
import { PageHeader } from "@/components/ui/PageHeader";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogSearch } from "@/components/blog/BlogSearch";

interface BlogPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ q?: string; category?: string; tag?: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const generateMetadata = ({ params }: { params: Promise<{ locale: Locale }> }) =>
  getPageMetadata({ params, section: "blog" });

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const [{ locale }, { q, category, tag }] = await Promise.all([params, searchParams]);

  if (!locales.includes(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const rawPosts = await getPostsByLocale(locale);

  // Yan panel verileri (Filtrelenmemiş ana liste üzerinden)
  const categories = [...new Set(rawPosts.flatMap((p) => p.category ?? []))].filter(Boolean);
  const tags = [...new Set(rawPosts.flatMap((p) => p.tags ?? []))].filter(Boolean);

  // --- SERVER-SIDE FILTERING ---
  const filteredPosts = rawPosts
    .filter((post) => {
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
    })
    .map((p) => {
      const url = buildPostUrl(p);
      return {
        // Sadece 'plain' verileri (p.data içindekiler) gönderiyoruz
        title: p.title,
        description: p.description,
        date: p.date,
        category: p.category,
        tags: p.tags,
        coverImage: p.coverImage,
        url: url, // parsePost'tan gelen temiz URL
      };
    });

  return (
    <main>
      <PageHeader
        title={t("title")}
        description={t("description")}
        eyebrow={t("eyebrow")}
      />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* İÇERİK ALANI */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <BlogSearch placeholder={t("search.placeholder")} defaultValue={q} />
            </div>

            {/* Aktif Filtre Rozetleri */}
            {(q || category || tag) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {q && <FilterBadge label={`"${q}"`} />}
                {category && <FilterBadge label={category} />}
                {tag && <FilterBadge label={`#${tag}`} />}
                <Link href="/blog" className="text-[10px] font-bold uppercase px-3 py-1 bg-muted hover:bg-border rounded-full transition-colors">
                  {t("filter.clear")}
                </Link>
              </div>
            )}

            <p className="text-sm text-muted-foreground mb-6">
              {t("results.count", { count: filteredPosts.length })}
            </p>

            <Suspense fallback={<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 opacity-50">Loading...</div>}>
              {filteredPosts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredPosts.map((post) => (
                    <BlogCard key={post.url} post={post} locale={locale} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
                  <p className="text-xl font-black uppercase tracking-tighter text-muted-foreground/20">{t("empty.title")}</p>
                  <p className="text-sm text-muted-foreground">{t("empty.description")}</p>
                </div>
              )}
            </Suspense>
          </div>

          {/* SAĞ PANEL (SIDEBAR) */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <SidebarSection title={t("sidebar.categories")}>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/blog?category=${encodeURIComponent(cat)}`}
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
                    href={`/blog?tag=${encodeURIComponent(t_)}`}
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
    </main>
  );
}

// --- YARDIMCI BİLEŞENLER (Aynı Dosyada) ---

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