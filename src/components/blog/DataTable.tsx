/**
 * DataTable — Genel amaçlı veri tablosu
 *
 * İlk sütun otomatik olarak vurgulanır (label gibi davranır).
 * Uzun metinler satır iner, overflow yoktur.
 *
 * @param columns - Başlık dizisi, örn. ["Özellik", "Değer", "Birim"]
 * @param rows    - Satır dizisi. Her satır bir string dizisidir, sütun sayısıyla eşleşmeli.
 *
 * @example
 * <DataTable
 *   columns={["Parametre", "Min", "Max", "Birim"]}
 *   rows={[
 *     ["Çalışma Basıncı", "1", "16", "bar"],
 *     ["Sıcaklık Aralığı", "-10", "110", "°C"],
 *     ["Debi", "0.5", "120", "m³/h"],
 *   ]}
 * />
 */
interface DataTableProps {
  columns: string[];
  rows: string[][];
}

export default function DataTable({ columns, rows }: DataTableProps) {
  if (!columns || !rows) return null;

  return (
    <div className="overflow-x-auto my-6 border border-border rounded-xl">
      <table className="min-w-full bg-card">
        <thead className="bg-muted/50">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left text-xs font-black text-foreground uppercase tracking-widest border-b border-border"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-muted/30 transition-colors">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-6 py-4 text-sm leading-relaxed align-top ${
                    cellIndex === 0
                      ? 'font-semibold text-foreground'
                      : 'font-medium text-muted-foreground'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}