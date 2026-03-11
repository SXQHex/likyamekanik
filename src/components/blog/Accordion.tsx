'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';

/**
 * Accordion — Açılır kapanır SSS bileşeni
 *
 * Tek seferde yalnızca bir öğe açık kalır (single collapsible).
 * Framer Motion (motion/react) ile smooth animasyon.
 *
 * @param items - Soru/cevap dizisi. Her öğede `question` ve `answer` zorunlu.
 *
 * @example
 * <Accordion items={[
 *   {
 *     question: "Isı pompası kışın da çalışır mı?",
 *     answer: "Evet, -15°C'ye kadar verimli çalışan modeller mevcuttur."
 *   },
 *   {
 *     question: "COP değeri nedir?",
 *     answer: "Tüketilen her 1 kW elektrik için üretilen ısı miktarıdır."
 *   },
 * ]} />
 */
interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full space-y-2">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="w-full px-4 py-3.5 flex justify-between items-center text-left hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
            >
              <span className="font-medium text-sm pr-4">{item.question}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="shrink-0 text-muted-foreground"
                style={{ display: 'flex' }}
              >
                <Plus size={16} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="px-4 pb-4 pt-1 border-t border-border">
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}