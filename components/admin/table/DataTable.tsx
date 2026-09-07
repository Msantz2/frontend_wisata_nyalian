'use client';

import { LoadingState } from '../feedback/LoadingState';
import { EmptyState } from '../feedback/EmptyState';
import type { DataTableProps } from './types';

export function DataTable({
  columns,
  data,
  loading = false,
  empty = false,
  emptyMessage = 'No data found',
  loadingCount = 5,
  className,
}: DataTableProps) {
  if (loading) {
    return <LoadingState count={loadingCount} />;
  }

  if (empty || data.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${className || ''}`}>
        <thead>
          <tr className="border-b bg-muted/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-sm font-semibold"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
         <tbody>
           {data.map((row, idx) => (
             <tr key={`row-${idx}-${row.id || JSON.stringify(row).substring(0, 20)}`} className="border-b hover:bg-muted/50">
               {columns.map((col) => {
                 const cellValue = row[col.key];
                 const rendered = col.render
                   ? col.render(cellValue, row)
                   : String(cellValue ?? '');
                 return (
                   <td
                     key={col.key}
                     className={`px-4 py-3 text-sm ${col.className || ''}`}
                   >
                     {rendered}
                   </td>
                 );
               })}
             </tr>
           ))}
         </tbody>
      </table>
    </div>
  );
}
