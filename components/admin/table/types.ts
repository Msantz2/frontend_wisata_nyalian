export interface ColumnDef {
  key: string;
  header: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  className?: string;
}

export interface DataTableProps {
  columns: ColumnDef[];
  data: Record<string, unknown>[];
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  loadingCount?: number;
  className?: string;
}

