import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/lib/navigation";
import { getBlogPostMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema, generateTechArticleSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { getTranslations, getFormatter } from "next-intl/server";
import { type Locale } from "@/lib/locales";
import { type BlogPost } from "@/lib/blog";
import {
  getPost,
  getAllPostParams,
  getPostsByLocale,
  getClusterPosts,
  getPillarPost,
  getPostTree,
  getBreadcrumbSegments,
  buildPostUrl
} from "@/lib/blog";
import { MDXContent } from "@/components/blog/MDXContent";
import { BlogCard } from "@/components/blog/BlogCard";
import { Calendar, ChevronLeft } from "lucide-react";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { CTASection } from "@/components/CTASection";
import { MobileNav } from "@/components/blog/MobileNav";
import { SidebarTOC } from "@/components/blog/SidebarTOC";

export function generateStaticParams() {
  return getAllPostParams();
}

export const generateMetadata = ({ params }: { params: Promise<{ locale: Locale; slug: string }> }) =>
  getBlogPostMetadata(params);

export default async function BlogPostPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const post = await getPost(locale, slug);
  if (!post) notFound();

  const currentPostUrl = buildPostUrl(post);
  const t = await getTranslations({ locale, namespace: "blog" });
  const tGlobal = await getTranslations({ locale, namespace: "nav" });
  const format = await getFormatter();

  const formattedDate = format.dateTime(new Date(post.date), {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const allPosts = await getPostsByLocale(locale);
  const tree = getPostTree(locale, post);
  const segments = getBreadcrumbSegments(locale, post);

  const sanitizePost = (p: BlogPost) => ({
    title: p.title,
    description: p.description,
    date: p.date,
    coverImage: p.coverImage,
    url: buildPostUrl(p),
    category: p.category,
    tags: p.tags,
  });

  const articleSchema = generateTechArticleSchema(post, locale);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: tGlobal("home"), item: `/${locale}` },
    { name: tGlobal("blog"), item: `/${locale}/blog` },
    { name: post.title, item: `/${locale}/blog/${post.slug}` }
  ]);

  const fullSchema = {
    "@context": "https://schema.org",
    "@graph": [articleSchema, breadcrumbSchema]
  };

  return (
    <>
      <JsonLd schema={fullSchema} />
      {tree && (
        <MobileNav
          tree={tree}
          segments={segments}
          toc={post.toc}
          tocLabel={t("toc")}
        />
      )}
      <main className="mx-auto px-4 py-8 md:py-12">
        <div className="container mx-auto flex flex-col lg:flex-row gap-8 max-w-360 items-start">
          {tree && (
            <aside className="hidden lg:block w-64 shrink-0 lg:sticky lg:top-28 border-r border-primary/10 pl-4 h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
              <BlogSidebar
                tree={tree}
                activeUrl={currentPostUrl}
                label={tree.title}
              />
            </aside>
          )}

          <div className="flex-3 min-w-0 max-w-4xl w-full" id="post-content">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              {t("backToBlog")}
            </Link>

            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {post.category?.[0] && (
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                    {post.category[0]}
                  </span>
                )}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <time dateTime={post.date}>{formattedDate}</time>
                </div>
              </div>

              <h1 className="text-2xl md:text-4xl font-black text-foreground uppercase tracking-tighter leading-[1.1] mb-4">
                {post.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                {post.description}
              </p>
            </header>

            {post.coverImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-10 border border-border">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
            )}

            <article className="prose prose-neutral dark:prose-invert max-w-none 
              prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
              prose-h1:text-4xl prose-h2:text-2xl prose-h2:border-b prose-h2:border-border prose-h2:pb-2
              prose-h3:text-xl
              prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed
              prose-li:list-disc prose-li:marker:text-primary prose-ul:my-6 prose-li:my-2">
              <MDXContent code={post.code} />
            </article>

            {post.cta && (
              <CTASection
                id="blog-cta"
                title={post.cta.title}
                description={post.cta.description}
                button={post.cta.button}
                whatsappMessage={post.cta.whatsappMessage}
              />
            )}

            {/* PILLAR - CLUSTER TEK SATIR NAVİGASYON */}
            {(post.pillarKey || post.category?.[0]) && (
              <div className="mt-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]">
                {post.pillarKey && (() => {
                  const pillar = getPillarPost(post.pillarKey!, locale);
                  if (!pillar) return null;
                  return (
                    <Link
                      href={buildPostUrl(pillar)}
                      className="text-primary hover:text-foreground transition-colors"
                    >
                      {pillar.title}
                    </Link>
                  );
                })()}

                {post.pillarKey && post.category?.[0] && (
                  <span className="text-muted-foreground/30">•</span>
                )}

                {post.category?.[0] && (
                  <span className="text-muted-foreground">
                    {post.category[0]}
                  </span>
                )}
              </div>
            )}

            {/* HİYERARŞİK RELATED SECTION */}
            {(() => {
              let relatedContent = post.pillarKey ? getClusterPosts(post.pillarKey, locale) : [];

              if (relatedContent.length <= 1 && post.category?.[0]) {
                relatedContent = allPosts.filter(p =>
                  p.category?.[0] === post.category?.[0]
                );
              }

              const finalRelated = relatedContent
                .filter(p => p.slug !== post.slug)
                .slice(0, 3);
              if (finalRelated.length === 0) return null;

              return (
                <section className="mt-8 pt-8 border-t border-border">
                  <h2 className="text-xl font-black text-foreground uppercase tracking-tighter mb-6">
                    {post.pillarKey ? (getPillarPost(post.pillarKey, locale)?.title) : post.category?.[0]}
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {finalRelated.map((p) => (
                      <BlogCard
                        key={p.slug}
                        post={sanitizePost(p)}
                        locale={locale}
                      />
                    ))}
                  </div>
                </section>
              );
            })()}
          </div>
          <aside className="hidden lg:block w-64 shrink-0 lg:sticky lg:top-28 self-start h-[calc(100vh-8rem)] pr-4">
            <SidebarTOC
              toc={post.toc}
              label={t("toc")}
            />
          </aside>
        </div>
      </main>
    </>
  );
}