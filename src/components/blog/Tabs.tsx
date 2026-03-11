'use client';

import { useState } from 'react';

/**
 * Tabs — Sekmeli içerik bileşeni
 *
 * MDX içinde JSX nesnesi olarak içerik geçilir.
 * Aynı konunun farklı versiyonlarını (konut/ticari/endüstriyel) göstermek için idealdir.
 *
 * @param tabs - Sekme dizisi. Her öğede `label` (sekme başlığı) ve `content` (JSX içerik) zorunlu.
 *
 * @example
 * <Tabs tabs={[
 *   { label: "Konut", content: <p>Konut tipi ısı pompası sistemleri...</p> },
 *   { label: "Ticari", content: <p>Ticari sistemlerde minimum 2 kompresör...</p> },
 *   { label: "Endüstriyel", content: <p>Endüstriyel uygulamalarda...</p> },
 * ]} />
 */
interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export default function Tabs({ tabs }: TabsProps) {
  const [active, setActive] = useState(0);
  if (!tabs?.length) return null;

  return (
    <div className="my-6 border border-border rounded-xl overflow-hidden">
      <div className="flex overflow-x-auto border-b border-border bg-muted/30">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer ${
              active === i
                ? 'text-primary border-b-2 border-primary bg-card'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 sm:p-5 bg-card text-sm text-foreground leading-relaxed">
        {tabs[active].content}
      </div>
    </div>
  );
}