'use client';

import { AnchorProvider, ScrollProvider, TOCItem, type TOCItemType } from 'fumadocs-core/toc';
import { useRef } from 'react';
import { cn } from "@/lib/utils";

interface TocProps {
  items: TOCItemType[];
  label: string;
}

export function Toc({ items, label }: TocProps) {
  // Post içeriğinin olduğu container'ı değil, window'u izlemek için null bırakabiliriz
  // Ancak dokümantasyondaki gibi bir ref üzerinden gitmek en sağlıklısıdır.
  const containerRef = useRef<HTMLDivElement>(null);
  const validItems = items.filter(item => item.url && item.url !== "#undefined");

  if (validItems.length === 0) return null;

  return (
    <aside className="sticky top-32 hidden w-64 shrink-0 lg:block border-l border-primary/10 pl-6 h-fit">
      {/* AnchorProvider aktif başlığı (activeId) yönetir */}
      <AnchorProvider toc={validItems}>
        <div ref={containerRef} className="flex flex-col gap-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">
            {label}
          </h4>
          
          {/* ScrollProvider artık doğru prop (containerRef) ile çalışıyor */}
          <ScrollProvider containerRef={containerRef}>
            <nav className="flex flex-col gap-4">
              {validItems.map((item) => (
                <TOCItem
                  key={item.url}
                  href={item.url}
                  className={cn(
                    "block text-left text-[11px] uppercase tracking-widest transition-all duration-300 outline-none",
                    "aria-current:text-primary aria-current:font-bold aria-current:translate-x-1",
                    "text-muted-foreground hover:text-foreground",
                    item.depth === 3 && "ml-4 border-l border-primary/5 pl-3"
                  )}
                >
                  {item.title}
                </TOCItem>
              ))}
            </nav>
          </ScrollProvider>
        </div>
      </AnchorProvider>
    </aside>
  );
}