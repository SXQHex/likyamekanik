import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * FormulaBlock — Vurgulu display math bloğu
 *
 * rehype-katex'in `$$...$$` render'ından görsel olarak farklılaşmak için.
 * Başlık, açıklama ve değişken listesi eklenebilir.
 *
 * @param formula     - LaTeX formatında formül (displayMode: true ile render edilir)
 * @param label       - Formülün adı, örn. "Darcy-Weisbach Denklemi" (opsiyonel)
 * @param description - Formül altı kısa açıklama (opsiyonel)
 * @param vars        - Değişken listesi: { symbol, desc }[] (opsiyonel)
 *
 * @example
 * // Sadece formül
 * <FormulaBlock formula="\Delta P = f \cdot \frac{L}{D} \cdot \frac{\rho v^2}{2}" />
 *
 * // Tam kullanım
 * <FormulaBlock
 *   label="Isı Pompası COP"
 *   formula="\text{COP}_{\text{max}} = \frac{T_H}{T_H - T_L}"
 *   description="Carnot çevrimine göre teorik maksimum verim. Gerçek COP bu değerin %40–60'ı arasındadır."
 *   vars={[
 *     { symbol: "T_H", desc: "Sıcak rezervuar sıcaklığı (K)" },
 *     { symbol: "T_L", desc: "Soğuk rezervuar sıcaklığı (K)" },
 *   ]}
 * />
 */
interface FormulaVar {
  symbol: string;
  desc: string;
}

interface FormulaBlockProps {
  formula: string;
  label?: string;
  description?: string;
  vars?: FormulaVar[];
}

export default function FormulaBlock({ formula, label, description, vars }: FormulaBlockProps) {
  if (!formula) return null;

  const html = katex.renderToString(formula, {
    throwOnError: false,
    displayMode: true,
  });

  return (
    <div className="my-6 border border-border border-l-3 border-l-primary rounded-lg bg-card p-4 sm:p-5 overflow-hidden">
      {label && (
        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">
          {label}
        </p>
      )}
      <div
        className="overflow-x-auto text-foreground"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {description && (
        <p className="mt-3 pt-3 border-t border-border text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
      {vars && vars.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {vars.map((v, i) => (
            <span key={i} className="text-[11px] bg-muted text-muted-foreground rounded px-2 py-0.5">
              <span className="font-semibold text-foreground">{v.symbol}</span>
              {' — '}
              {v.desc}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}