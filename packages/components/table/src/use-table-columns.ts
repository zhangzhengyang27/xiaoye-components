import { computed, shallowRef } from "vue";
import type { TableColumnRegistration, TableContext } from "./context";

export function useTableColumns<T = Record<string, unknown>>() {
  const registrations = shallowRef<TableColumnRegistration<T>[]>([]);

  const registerColumn: TableContext<T>["registerColumn"] = (column) => {
    registrations.value = [...registrations.value, column].sort((left, right) => left.order - right.order);
  };

  const unregisterColumn: TableContext<T>["unregisterColumn"] = (uid) => {
    registrations.value = registrations.value.filter((column) => column.uid !== uid);
  };

  const columns = computed(() =>
    registrations.value
      .slice()
      .sort((left, right) => left.order - right.order)
      .map((column) => column.descriptor.value)
  );

  return {
    columns,
    registerColumn,
    unregisterColumn
  };
}
