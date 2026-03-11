'use client';

import { useEffect, useRef, useId } from 'react';
import mermaid from 'mermaid';

/**
 * Mermaid — MDX içinde akış diyagramı bileşeni
 *
 * Diyagramları mermaid.live adresinde yazıp test edebilirsin.
 * Syntax referansı: https://mermaid.js.org/syntax/flowchart.html
 *
 * @param chart - Mermaid sözdiziminde diyagram metni (template literal kullan)
 *
 * @example
 * <Mermaid chart={`
 * flowchart LR
 *   A[Bina Girişi] --> B[Yangın Algılama]
 *   B --> C{Alarm Tipi}
 *   C -->|Duman| D[Sprinkler]
 *   C -->|Isı| E[Yangın Dolabı]
 *   D --> F[İtfaiye]
 *   E --> F
 * `} />
 */
interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    if (!ref.current || !chart) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      flowchart: { curve: 'basis', useMaxWidth: true },
    });

    mermaid
      .render(`mermaid-${id}`, chart.trim())
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg;
      })
      .catch((err) => {
        if (ref.current)
          ref.current.innerHTML = `<pre class="text-destructive text-xs p-4">${err.message}</pre>`;
      });
  }, [chart, id]);

  return (
    <div
      ref={ref}
      className="my-6 overflow-x-auto rounded-xl border border-border bg-card p-4"
    />
  );
}