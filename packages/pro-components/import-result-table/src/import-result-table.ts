import type { ProTableColumn } from "../../pro-table";

export interface ImportResultSummary {
  total: number;
  success: number;
  failed: number;
}

export interface ImportResultTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: ProTableColumn<T>[];
  summary?: ImportResultSummary;
  loading?: boolean;
}
