'use client';

import { useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { MobileBreadcrumb } from './MobileBreadcrumb';
import { type BlogTreeNode } from "@/lib/blog";
import { type TOCItemType } from "fumadocs-core/toc"; // Doğru tipi buradan çekiyoruz
import { cn } from "@/lib/utils";

interface MobileNavProps {
  tree: BlogTreeNode;
  locale: string;
  slug: string;
  toc: TOCItemType[];
  tocLabel: string;
}

export function MobileNav({ tree, locale, slug, toc, tocLabel }: MobileNavProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const safeToc = toc.filter(item => item.url && item.url !== "#" && item.url !== "#undefined");
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        detailsRef.current.open = false;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="sticky lg:hidden mb-8 bg-secondary/20 p-4 border border-primary/5 top-16 z-10 backdrop-blur-xl">
      <MobileBreadcrumb 
        tree={tree} 
        activeUrl={`/${locale}/blog/${slug}`} 
        locale={locale} 
      /> 
      <div className="pt-2 border-t border-primary/5">
        <details ref={detailsRef} className="group">
          <summary className="list-none flex items-center justify-between cursor-pointer py-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
              {tocLabel}
            </span>
            <ChevronRight className="size-4 text-primary transition-transform group-open:rotate-90" />
          </summary>
          
          <div className={cn(
              "mt-4 animate-in fade-in slide-in-from-top-1 duration-300",
              "max-h-[60vh] overflow-y-auto custom-scrollbar pr-2",
              "**:data-radix-collapsible-trigger:hidden", 
              "[&_nav]:p-0 [&_nav]:border-none shadow-none"
            )}>
            <InlineTOC 
              items={safeToc} 
              defaultOpen={true}
            />
          </div>
        </details>
      </div>
    </div>
  );
}