import { FileText, Download } from 'lucide-react';

/**
 * DownloadCard — Dosya indirme kartı
 *
 * Teknik şartname, katalog, standart belgesi gibi indirilebilir dosyalar için.
 * `href` doğrudan `/public/static/` altındaki bir dosyaya veya dış URL'e işaret edebilir.
 *
 * @param title       - Dosya adı veya belge başlığı
 * @param description - Kısa açıklama (opsiyonel)
 * @param href        - İndirme bağlantısı
 * @param fileType    - Dosya uzantısı etiketi: 'PDF', 'XLSX', 'DWG' vb. (varsayılan: 'PDF')
 * @param fileSize    - Dosya boyutu, örn. '2.4 MB' (opsiyonel)
 *
 * @example
 * <DownloadCard
 *   title="TS EN 12845 Uygulama Özeti"
 *   description="Sabit söndürme sistemleri temel gereksinimler"
 *   href="/static/ts-en-12845-ozet.pdf"
 *   fileType="PDF"
 *   fileSize="1.2 MB"
 * />
 *
 * <DownloadCard
 *   title="Isı Pompası Hesap Tablosu"
 *   href="/static/cop-hesap.xlsx"
 *   fileType="XLSX"
 *   fileSize="340 KB"
 * />
 */
interface DownloadCardProps {
  title: string;
  description?: string;
  href: string;
  fileType?: string;
  fileSize?: string;
}

export default function DownloadCard({
  title,
  description,
  href,
  fileType = 'PDF',
  fileSize,
}: DownloadCardProps) {
  return (
    <a
      href={href}
      download
      target="_blank"
      rel="noopener noreferrer"
      className="group my-4 flex items-center gap-4 border border-border rounded-xl bg-card px-4 py-3.5 hover:border-primary/30 hover:bg-primary/5 transition-colors no-underline"
    >
      <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center text-primary">
        <FileText size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-1.5 py-0.5 rounded">
            {fileType}
          </span>
          {fileSize && (
            <span className="text-[11px] text-muted-foreground">{fileSize}</span>
          )}
        </div>
      </div>
      <Download
        size={16}
        className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors"
      />
    </a>
  );
}