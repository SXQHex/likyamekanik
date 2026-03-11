'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link, type Href } from '@/lib/navigation';
// import { type BlogTreeNode } from "@/lib/blog"; // Removed as per instruction

interface MobileBreadcrumbProps {
  segments: { title: string; url: Href }[];
}

export function MobileBreadcrumb({ segments }: MobileBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 overflow-hidden">
      <Link href="/" className="hover:text-primary transition-colors shrink-0">
        Home
      </Link>
      <ChevronRight className="size-2.5 shrink-0 opacity-20" />
      <Link href="/blog" className="hover:text-primary transition-colors shrink-0">
        Blog
      </Link>

      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="size-2.5 shrink-0 opacity-20" />
            {isLast ? (
              <span className="text-primary truncate font-black">
                {segment.title}
              </span>
            ) : (
              <Link
                href={segment.url}
                className="hover:text-primary transition-colors truncate max-w-[80px]"
              >
                {segment.title}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
