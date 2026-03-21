<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed } from "vue";
import { useNamespace } from "@xiaoye/composables";
import XyEmpty from "../../empty";

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: string | number;
  align?: "left" | "center" | "right";
  slot?: string;
  formatter?: (row: T, column: TableColumn<T>, rowIndex: number) => unknown;
}

export interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  striped?: boolean;
  bordered?: boolean;
  emptyText?: string;
  loadingText?: string;
  rowKey?: keyof T | ((row: T, rowIndex: number) => string | number);
  rowClassName?: string | ((row: T, rowIndex: number) => string);
  clickable?: boolean;
}

const props = withDefaults(defineProps<TableProps<T>>(), {
  loading: false,
  striped: false,
  bordered: false,
  emptyText: "暂无数据",
  loadingText: "Loading...",
  rowKey: undefined,
  rowClassName: "",
  clickable: false
});
const emit = defineEmits<{
  rowClick: [row: T, rowIndex: number, event: MouseEvent | KeyboardEvent];
}>();

const ns = useNamespace("table");

const hasData = computed(() => props.data.length > 0);

function getValue(row: T, column: TableColumn<T>, rowIndex: number) {
  if (column.formatter) {
    return column.formatter(row, column, rowIndex);
  }

  const key = (column.dataIndex ?? column.key) as keyof T;
  return row[key] as unknown;
}

function getRowKey(row: T, rowIndex: number) {
  if (typeof props.rowKey === "function") {
    return props.rowKey(row, rowIndex);
  }

  if (props.rowKey) {
    return row[props.rowKey] as string | number;
  }

  return rowIndex;
}

function getRowClassName(row: T, rowIndex: number) {
  if (typeof props.rowClassName === "function") {
    return props.rowClassName(row, rowIndex);
  }

  return props.rowClassName;
}

function handleRowClick(row: T, rowIndex: number, event: MouseEvent | KeyboardEvent) {
  emit("rowClick", row, rowIndex, event);
}

function handleRowKeydown(row: T, rowIndex: number, event: KeyboardEvent) {
  if (!props.clickable) {
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handleRowClick(row, rowIndex, event);
  }
}
</script>

<template>
  <div
    :class="[
      ns.base.value,
      ns.is('striped', props.striped),
      ns.is('bordered', props.bordered),
      ns.is('loading', props.loading),
      ns.is('clickable', props.clickable)
    ]"
    :aria-busy="props.loading"
  >
    <div v-if="props.loading" class="xy-table__loading">
      <slot name="loading">
        {{ props.loadingText }}
      </slot>
    </div>
    <table>
      <thead>
        <tr>
          <th
            v-for="column in props.columns"
            :key="column.key"
            :style="{ width: column.width ? `${column.width}` : undefined, textAlign: column.align }"
          >
            <slot :name="column.slot ? `header-${column.slot}` : `header-${column.key}`" :column="column">
              {{ column.title }}
            </slot>
          </th>
        </tr>
      </thead>
      <tbody v-if="hasData">
        <tr
          v-for="(row, rowIndex) in props.data"
          :key="getRowKey(row, rowIndex)"
          :class="['xy-table__row', getRowClassName(row, rowIndex)]"
          :tabindex="props.clickable ? 0 : undefined"
          @click="handleRowClick(row, rowIndex, $event)"
          @keydown="handleRowKeydown(row, rowIndex, $event)"
        >
          <td
            v-for="column in props.columns"
            :key="column.key"
            :style="{ textAlign: column.align }"
          >
            <slot
              :name="column.slot ? `cell-${column.slot}` : `cell-${column.key}`"
              :row="row"
              :column="column"
              :row-index="rowIndex"
              :value="getValue(row, column, rowIndex)"
            >
              {{ getValue(row, column, rowIndex) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!hasData && !props.loading" class="xy-table__empty">
      <slot name="empty">
        <xy-empty :description="props.emptyText" />
      </slot>
    </div>
  </div>
</template>
