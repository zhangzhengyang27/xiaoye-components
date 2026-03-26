<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed } from "vue";
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
}>(), {
  columns: undefined,
  panel: "main"
});

const leafColumns = computed(() => flattenColumns(props.columns ?? props.store.normalizedColumns.value));

function resolveCellClassName(column: TableResolvedColumn<T>) {
  return [
    "xy-table__footer-cell",
    `is-${column.align}`,
    column.className,
    props.panel !== "main" ? "is-fixed-panel-cell" : ""
  ];
}

function resolveColWidth(column: TableResolvedColumn<T>) {
  return {
    width: toCssSize(column.realWidth),
    minWidth: toCssSize(column.realWidth)
  };
}
</script>

<template>
  <table class="xy-table__footer-table">
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
