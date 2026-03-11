import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

type CalloutType = 'info' | 'warning' | 'tip' | 'danger';

const styles: Record<CalloutType, { icon: React.ReactNode; classes: string; label: string }> = {
  info: {
    icon: <Info size={15} />,
    classes: 'bg-blue-500/5 border-blue-500/20 text-blue-600 dark:text-blue-400',
    label: 'Bilgi',
  },
  warning: {
    icon: <AlertTriangle size={15} />,
    classes: 'bg-yellow-500/5 border-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    label: 'Uyarı',
  },
  tip: {
    icon: <CheckCircle size={15} />,
    classes: 'bg-green-500/5 border-green-500/20 text-green-600 dark:text-green-400',
    label: 'İpucu',
  },
  danger: {
    icon: <XCircle size={15} />,
    classes: 'bg-red-500/5 border-red-500/20 text-red-600 dark:text-red-400',
    label: 'Dikkat',
  },
};

/**
 * Callout — Vurgulu bilgi kutusu
 *
 * @param type    - 'info' | 'warning' | 'tip' | 'danger'  (varsayılan: 'info')
 * @param title   - Başlık. Belirtilmezse type'a göre otomatik ('Bilgi', 'Uyarı' vb.)
 * @param children - Kutu içeriği (string veya JSX)
 *
 * @example
 * <Callout type="warning">Boru basıncı 6 bar'ı geçmemeli.</Callout>
 * <Callout type="danger" title="Zorunlu">Sistemi kapatmadan müdahale etme.</Callout>
 * <Callout type="tip">Yalıtım kalınlığını TS 825'e göre hesapla.</Callout>
 */
interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

export default function Callout({ type = 'info', title, children }: CalloutProps) {
  const s = styles[type];
  return (
    <div className={`my-5 border rounded-lg p-4 ${s.classes}`}>
      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest mb-1.5">
        {s.icon}
        {title ?? s.label}
      </div>
      <div className="text-sm leading-relaxed text-foreground/80">{children}</div>
    </div>
  );
}