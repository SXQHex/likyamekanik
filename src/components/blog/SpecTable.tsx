/**
 * SpecTable — Teknik özellik tablosu
 *
 * İki modda çalışır:
 * 1. Tek ürün (key-value): `products` prop'u verilmez, her satırda bir değer olur.
 * 2. Çoklu ürün karşılaştırma: `products` dizisi verilir, değerler yan yana gösterilir.
 *
 * Gruplar isteğe bağlıdır; `group` başlığı verilirse satırlar o başlık altında toplanır.
 *
 * @param products - Sütun başlıkları (çoklu ürün modunda), örn. ["Model A", "Model B"]
 * @param specs    - Grup ve satır dizisi
 *
 * @example
 * // Tek ürün
 * <SpecTable specs={[
 *   { rows: [
 *     { label: "Kapasite", values: ["12 kW"], unit: "kW" },
 *     { label: "COP", values: ["4.2"] },
 *   ]}
 * ]} />
 *
 * // Gruplu + çoklu ürün karşılaştırma
 * <SpecTable
 *   products={["Konut 8kW", "Konut 12kW", "Ticari 20kW"]}
 *   specs={[
 *     {
 *       group: "Isıtma Performansı",
 *       rows: [
 *         { label: "Kapasite", values: ["8 kW", "12 kW", "20 kW"], unit: "kW" },
 *         { label: "COP A7/W35", values: ["3.8", "4.2", "4.6"] },
 *       ]
 *     },
 *     {
 *       group: "Elektrik",
 *       rows: [
 *         { label: "Besleme", values: ["1~/220V", "1~/220V", "3~/380V"] },
 *         { label: "Maks. Akım", values: ["12 A", "16 A", "14 A"], unit: "A" },
 *       ]
 *     }
 *   ]}
 * />
 */
interface SpecRow {
  label: string;
  values: string[];
  unit?: string;
}

interface SpecGroup {
  group?: string;
  rows: SpecRow[];
}

interface SpecTableProps {
  products?: string[];
  specs: SpecGroup[];
}

export default function SpecTable({ products, specs }: SpecTableProps) {
  if (!specs) return null;

  const isComparison = products && products.length > 0;

  return (
    <div className="overflow-x-auto my-6 border border-border rounded-xl">
      <table className="min-w-full bg-card text-sm">
        {isComparison && (
          <thead className="bg-muted/50">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-black text-foreground uppercase tracking-widest border-b border-border w-40" />
              {products.map((p, i) => (
                <th
                  key={i}
                  className="px-5 py-3.5 text-left text-xs font-black text-foreground uppercase tracking-widest border-b border-border"
                >
                  {p}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {specs.map((section, si) => (
            <>
              {section.group && (
                <tr key={`group-${si}`}>
                  <td
                    colSpan={isComparison ? (products!.length + 1) : 2}
                    className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-primary bg-primary/5 border-y border-border"
                  >
                    {section.group}
                  </td>
                </tr>
              )}
              {section.rows.map((row, ri) => (
                <tr
                  key={`${si}-${ri}`}
                  className="hover:bg-muted/30 transition-colors divide-x divide-border border-b border-border last:border-0"
                >
                  <td className="px-5 py-3 font-semibold text-foreground whitespace-nowrap">
                    {row.label}
                    {row.unit && (
                      <span className="ml-1 text-xs text-muted-foreground font-normal">
                        ({row.unit})
                      </span>
                    )}
                  </td>
                  {row.values.map((val, vi) => (
                    <td key={vi} className="px-5 py-3 text-muted-foreground">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}