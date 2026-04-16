import type { ComputedRef, InjectionKey, Ref } from "vue";
import type { TableResolvedColumn } from "./table";

export interface TableColumnRegistration<T = Record<string, unknown>> {
  uid: string;
  order: Ref<number>;
  descriptor: ComputedRef<TableResolvedColumn<T>>;
}

export interface TableContext<T = Record<string, unknown>> {
  registerColumn: (column: TableColumnRegistration<T>) => void;
  unregisterColumn: (uid: string) => void;
}

export interface TableColumnContext<T = Record<string, unknown>> {
  uid: string;
  level: number;
  registerChildColumn: (column: TableColumnRegistration<T>) => void;
  unregisterChildColumn: (uid: string) => void;
}

export const tableContextKey = Symbol("xiaoye-table") as InjectionKey<
  TableContext<Record<string, unknown>>
>;

export const tableColumnContextKey = Symbol("xiaoye-table-column") as InjectionKey<
  TableColumnContext<Record<string, unknown>>
>;
