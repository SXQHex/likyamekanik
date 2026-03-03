'use client';

import { ChevronRight } from 'lucide-react';
import { MobileBreadcrumb } from './MobileBreadcrumb';
import { type BlogTreeNode, type TocEntry } from "@/lib/blog";

interface MobileNavProps {
  tree: BlogTreeNode;
  locale: string;
  slug: string;
  toc: TocEntry[];
  tocLabel: string;
}

export function MobileNav({ tree, locale, slug, toc, tocLabel }: MobileNavProps) {
  return (
    <div className="sticky lg:hidden mb-8 bg-secondary/20 p-4 border border-primary/5 top-16 z-10 backdrop-blur-xl">
      <MobileBreadcrumb
        tree={tree}
        activeUrl={`/${locale}/blog/${slug}`}
        locale={locale}
      />

      <div className="pt-2 border-t border-primary/5">
        <details className="group">
          <summary className="list-none flex items-center justify-between cursor-pointer py-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
              {tocLabel}
            </span>
            <ChevronRight className="size-4 text-primary transition-transform group-open:rotate-90" />
          </summary>

          <div className="mt-4 space-y-1">
            {toc.map((item) => (
              <a
                key={item.url}
                href={item.url}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1 pl-2 border-l-2 border-transparent hover:border-primary/30"
              >
                {item.title}
              </a>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}