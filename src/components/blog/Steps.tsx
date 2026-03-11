/**
 * Steps — Numaralı adım adım talimat listesi
 *
 * @param steps - Adım dizisi. Her adımda `title` zorunlu, `description` opsiyonel.
 *
 * @example
 * <Steps steps={[
 *   { title: "Ana vanayı kapat", description: "Hat basıncını tamamen boşalt." },
 *   { title: "Contayı değiştir" },
 *   { title: "Sistemi tekrar devreye al", description: "Basınç testini unut." },
 * ]} />
 */

interface Step {
  title: string;
  description?: string;
}

interface StepsProps {
  steps: Step[];
}

export default function Steps({ steps }: StepsProps) {
  if (!steps?.length) return null;

  return (
    <ol className="my-6 space-y-0">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-4 group">
          <div className="flex flex-col items-center">
            <div className="shrink-0 w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-black text-primary">
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="w-px flex-1 bg-border my-1" />
            )}
          </div>
          <div className={`pb-6 ${i === steps.length - 1 ? 'pb-0' : ''}`}>
            <p className="font-semibold text-sm text-foreground leading-7">{step.title}</p>
            {step.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                {step.description}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}