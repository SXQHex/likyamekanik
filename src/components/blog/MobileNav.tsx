'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import { MobileBreadcrumb } from './MobileBreadcrumb';
import { type BlogTreeNode, type TocEntry } from "@/lib/blog";
import { type Href } from '@/lib/navigation';

interface MobileNavProps {
  tree: BlogTreeNode;
  segments: { title: string; url: Href }[];
  toc: TocEntry[];
  tocLabel: string;
}

export function MobileNav({ tree, segments, toc, tocLabel }: MobileNavProps) {
  return (
    <div className="sticky lg:hidden mb-0.5 bg-secondary/20 p-2 border border-primary/5 top-16 z-10 backdrop-blur-xl">
      <div className="mb-2">
        <MobileBreadcrumb segments={segments} />
      </div>

      <div className="p-0.5 border-t border-primary/5">
        <details className="group">
          <summary className="list-none flex items-center justify-between cursor-pointer">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
              {tocLabel}
            </span>
            <ChevronDown className="size-5 text-primary transition-transform group-open:rotate-180" />
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