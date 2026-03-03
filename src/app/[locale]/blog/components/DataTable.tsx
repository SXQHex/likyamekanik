interface DataTableProps {
  columns: string[];
  rows: string[][];
}

export default function DataTable({ columns, rows }: DataTableProps) {
  // Veri yoksa patlamaması için guard clause
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
                  className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-medium"
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