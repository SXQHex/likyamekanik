'use client';

import { useState } from 'react';

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="border border-border rounded-lg">
          <button
            className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-muted transition-colors"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="font-medium">{item.title}</span>
            <span className="text-muted-foreground">
              {openIndex === index ? '−' : '+'}
            </span>
          </button>
          {openIndex === index && (
            <div className="px-4 py-3 border-t border-border">
              <p className="text-muted-foreground">{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
