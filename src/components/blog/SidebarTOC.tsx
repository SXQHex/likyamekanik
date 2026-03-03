"use client";

import { useEffect, useRef, useState } from 'react';
import { type TocEntry } from '@/lib/blog';
import { motion, AnimatePresence } from 'motion/react';
import { Link, usePathname } from '@/lib/navigation';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarTOCProps {
  toc: TocEntry[];
  label: string;
}

export function SidebarTOC({ toc, label }: SidebarTOCProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [indicator, setIndicator] = useState<{ top: number; height: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const activeSlug = params?.slug as string;

  useEffect(() => {
    const getFlattenedIds = (items: TocEntry[]): string[] => {
      return items.flatMap((item) => [item.url.replace('#', ''), ...getFlattenedIds(item.items)]);
    };

    const allIds = getFlattenedIds(toc);
    const headings = allIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id);
        }
      },
      { rootMargin: '-100px 0px -80% 0px', threshold: 0 }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  useEffect(() => {
    if (!activeId || !containerRef.current) return;

    const container = containerRef.current;
    const activeLink = container.querySelector(`a[href$="#${activeId}"]`) as HTMLElement;

    if (activeLink) {
      const containerHeight = container.offsetHeight;
      const linkOffsetTop = activeLink.offsetTop;
      const linkHeight = activeLink.offsetHeight;
      const linkPaddingLeft = parseInt(activeLink.style.paddingLeft || '0');

      setIndicator({
        top: linkOffsetTop,
        height: linkHeight,
        left: linkPaddingLeft,
      });

      const targetScrollTop = linkOffsetTop - containerHeight / 2 + linkHeight / 2;
      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      });
    }
  }, [activeId]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 mb-4 shrink-0">
        {label}
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto font-medium custom-scrollbar relative"
      >
        {/* Ana İz Çizgisi (Track) */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border/50" />

        {/* Hareketli Gösterge (Indicator) */}
        <AnimatePresence>
          {indicator && (
            <motion.div
              layoutId="toc-indicator"
              initial={false}
              animate={{
                top: indicator.top,
                height: indicator.height,
                left: indicator.left,
              }}
              className="absolute w-0.5 bg-primary z-10 rounded-full"
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            />
          )}
        </AnimatePresence>

        {(() => {
          const renderItems = (items: TocEntry[], depth = 0): React.ReactNode[] => {
            return items.flatMap((item) => {
              const id = item.url.replace('#', '');
              const isActive = activeId === id;
              const element = (
                <Link
                  key={item.url}
                  href={{
                    pathname: '/blog/[slug]',
                    params: { slug: activeSlug },
                    hash: item.url.replace('#', '')
                  }}
                  className={cn(
                    "block text-left text-[11px] uppercase tracking-widest transition-all duration-300 outline-none text-muted-foreground hover:text-foreground aria-current:text-primary aria-current:font-bold aria-current:translate-x-1 py-1"
                  )}
                  aria-current={isActive ? 'true' : undefined}
                  style={{ paddingLeft: `${depth * 12}px` }}
                >
                  {item.title}
                </Link>
              );
              return [element, ...renderItems(item.items, depth + 1)];
            });
          };
          return renderItems(toc);
        })()}
      </div>
    </div>
  );
}