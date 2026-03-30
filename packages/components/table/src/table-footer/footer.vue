<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, ref } from "vue";
import type { TableResolvedColumn } from "../table";
import { isPrimitiveTableValue, toCssSize } from "../table";
import type { TableStore } from "../store";
import { TableRenderValue } from "../render-value";
import { flattenColumns } from "../util";

type TablePanel = "main" | "left" | "right";

const props = withDefaults(defineProps<{
  store: TableStore<T>;
  columns?: TableResolvedColumn<T>[];
  panel?: TablePanel;
  tableWidth?: number;
}>(), {
  columns: undefined,
  panel: "main",
  tableWidth: undefined
});

const tableRef = ref<HTMLTableElement | null>(null);
const leafColumns = computed(() => flattenColumns(props.columns ?? props.store.normalizedColumns.value));

function resolveCellClassName(column: TableResolvedColumn<T>) {
  return [
    "xy-table__footer-cell",
    `is-${column.align}`,
    column.type === "selection" ? "xy-table__column--selection" : "",
    column.type === "expand" ? "xy-table__column--expand" : "",
    column.className,
    props.panel !== "main" ? "is-fixed-panel-cell" : "",
    ...resolveFixedColumnClassNames(column)
  ];
}

function resolveFixedColumnClassNames(column: TableResolvedColumn<T>) {
  if (props.panel === "main" || !column.fixed) {
    return [];
  }

  if (column.fixed === "left") {
    return [
      "xy-table-fixed-column--left",
      leafColumns.value[leafColumns.value.length - 1]?.uid === column.uid ? "is-last-column" : ""
    ];
  }

  return [
    "xy-table-fixed-column--right",
    leafColumns.value[0]?.uid === column.uid ? "is-first-column" : ""
  ];
}

function resolveColWidth(column: TableResolvedColumn<T>) {
  return {
    width: toCssSize(column.realWidth),
    minWidth: toCssSize(column.realWidth)
  };
}

function resolveTableStyle() {
  if (props.panel !== "main" || props.tableWidth === undefined) {
    return undefined;
  }

  return {
    width: toCssSize(props.tableWidth),
    minWidth: "100%"
  };
}

defineExpose({
  tableRef
});
</script>

<template>
  <table ref="tableRef" class="xy-table__footer-table" :style="resolveTableStyle()">
    <colgroup>
      <col
        v-for="column in leafColumns"
        :key="column.uid"
        :style="resolveColWidth(column)"
      />
    </colgroup>
    <tfoot>
      <tr class="xy-table__footer-row">
        <td
          v-for="column in leafColumns"
          :key="column.uid"
          :class="resolveCellClassName(column)"
        >
          <div class="xy-table__cell-inner">
            <span v-if="isPrimitiveTableValue(props.store.getSummaryValue(column))" class="xy-table__cell-text">
              {{ props.store.getSummaryValue(column) }}
            </span>
            <table-render-value v-else :value="props.store.getSummaryValue(column)" />
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
</template>
