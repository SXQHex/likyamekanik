import katex from 'katex';
import 'katex/dist/katex.min.css';

interface InlineMathProps {
  formula: string;
}

export default function InlineMath({ formula }: InlineMathProps) {
  if (!formula) return null;

  const html = katex.renderToString(formula, {
    throwOnError: false,
    displayMode: false,
  });

  return (
    <span
      className="inline-flex items-center mx-1 px-1.5 py-0.5 bg-primary/5 rounded border border-primary/10 text-primary font-medium text-xl"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}