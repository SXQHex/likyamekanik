'use client';

import 'katex/dist/katex.min.css';
import { InlineMath as KatexInline } from 'react-katex';

interface InlineMathProps {
  formula: string;
}

export default function InlineMath({ formula }: InlineMathProps) {
  if (!formula) return null;

  // Çarpı ve Karekök için otomatik temizlik (Opsiyonel ama hayat kurtarır)
  const cleanFormula = formula
    .replace(/×/g, '\\times')
    .replace(/√(\w+)/g, '\\sqrt{$1}') // √P gibi kullanımları \sqrt{P} yapar
    .replace(/√/g, '\\sqrt');

  return (
    <span className="inline-flex items-center mx-1 px-1.5 py-0.5 bg-primary/5 rounded border border-primary/10 text-primary font-medium">
      <KatexInline math={cleanFormula} />
    </span>
  );
}