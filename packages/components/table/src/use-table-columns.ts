import { computed, shallowRef } from "vue";
import type { TableColumnRegistration, TableContext } from "./context";

export function useTableColumns<T = Record<string, unknown>>() {
  const registrations = shallowRef<TableColumnRegistration<T>[]>([]);
  const sortRegistrations = (items: TableColumnRegistration<T>[]) =>
    items.slice().sort((left, right) => left.order.value - right.order.value);

  const registerColumn: TableContext<T>["registerColumn"] = (column) => {
    registrations.value = sortRegistrations([...registrations.value, column]);
  };

  const unregisterColumn: TableContext<T>["unregisterColumn"] = (uid) => {
    registrations.value = registrations.value.filter((column) => column.uid !== uid);
  };

  const columns = computed(() =>
    sortRegistrations(registrations.value).map((column) => column.descriptor.value)
  );

  return {
    columns,
    registerColumn,
    unregisterColumn
  };
}
