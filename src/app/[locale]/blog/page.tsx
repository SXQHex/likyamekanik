import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPageMetadata } from "@/lib/metadata";
import { locales, type Locale } from "@/lib/locales";
import { getPostsByLocale, buildPostUrl } from "@/lib/blog";
// UI Bileşenleri
import { PageHeader } from "@/components/ui/PageHeader";
import { CTASection } from "@/components/CTASection";
import { BlogPageClient } from "./components/BlogPageClient";

interface BlogPageProps {
  params: Promise<{ locale: Locale }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const generateMetadata = ({ params }: { params: Promise<{ locale: Locale }> }) =>
  getPageMetadata({ params, section: "/blog", namespace: "blog" });

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const rawPosts = await getPostsByLocale(locale);

  // Yan panel verileri (Tüm liste üzerinden)
  const categories = [...new Set(rawPosts.flatMap((p) => p.category ?? []))].filter(Boolean);
  const tags = [...new Set(rawPosts.flatMap((p) => p.tags ?? []))].filter(Boolean);

  const allPosts = rawPosts.map((p) => ({
    title: p.title,
    description: p.description,
    date: p.date,
    category: p.category,
    tags: p.tags,
    coverImage: p.coverImage,
    url: buildPostUrl(p),
  }));



  return (
    <main>
      <PageHeader
        title={t("title")}
        description={t("description")}
        eyebrow={t("eyebrow")}
      />

      <div className="container mx-auto px-4 py-4 md:py-2">
        <BlogPageClient
          locale={locale}
          allPosts={allPosts}
          categories={categories}
          tags={tags}
        />

        <CTASection
          id="blog-cta"
          title={t("cta.title")}
          description={t("cta.description")}
          button={t("cta.button")}
          whatsappMessage={t("cta.whatsappMessage")}
        />
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