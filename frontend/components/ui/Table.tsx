import React from 'react';
import { Spinner } from './Spinner';
import { EmptyState } from '../shared/EmptyState';

export interface ColumnDef<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor: (row: T) => string | number;
}

export function Table<T>({ columns, data, loading, emptyMessage = 'No data available', keyExtractor }: TableProps<T>) {
  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="w-full overflow-x-auto rounded-md border border-border">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-border">
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col" className="px-6 py-3 font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={keyExtractor(row)} className="bg-white border-b border-border hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                  {col.render ? col.render(row) : String((row as any)[col.key] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
