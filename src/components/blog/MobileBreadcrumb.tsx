'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { type BlogTreeNode } from "@/lib/blog";

interface MobileBreadcrumbProps {
  tree: BlogTreeNode;
  activeUrl: string;
  locale: string;
}

export function MobileBreadcrumb({ tree, activeUrl, locale }: MobileBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-xs text-muted-foreground">
      <Link href={`/${locale}`} className="hover:text-foreground transition-colors">
        Home
      </Link>
      <ChevronRight className="size-3" />
      <Link href={`/${locale}/blog`} className="hover:text-foreground transition-colors">
        Blog
      </Link>
      {tree && (
        <>
          <ChevronRight className="size-3" />
          <span className="text-foreground font-medium truncate">
            {tree.title}
          </span>
        </>
      )}
    </nav>
  );
}
