<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed } from "vue";
import XyCheckbox from "../../../checkbox";
import XyIcon from "../../../icon";
import FilterPanel from "../filter-panel.vue";
import { TableRenderSlot } from "../render-slot";
import type { TableHeaderCellStyle, TableHeaderRowStyle, TableResolvedColumn } from "../table";
import { toCssSize } from "../table";
import type { TableStore } from "../store";
import { buildHeaderRows, flattenColumns } from "../util";

type TablePanel = "main" | "left" | "right";

const props = withDefaults(
  defineProps<{
    store: TableStore<T>;
    columns?: TableResolvedColumn<T>[];
    panel?: TablePanel;
    showHeader?: boolean;
    headerRowClassName?: string | ((rowIndex: number) => string);
    headerRowStyle?: TableHeaderRowStyle;
    headerCellClassName?: string | ((column: TableResolvedColumn<T>, columnIndex: number) => string);
    headerCellStyle?: TableHeaderCellStyle<T>;
  }>(),
  {
    columns: undefined,
    panel: "main",
    showHeader: true,
    headerRowClassName: "",
    headerRowStyle: undefined,
    headerCellClassName: "",
    headerCellStyle: undefined
  }
);

const emit = defineEmits<{
  "header-click": [column: TableResolvedColumn<T>, event: MouseEvent];
  "header-contextmenu": [column: TableResolvedColumn<T>, event: MouseEvent];
  "header-dragend": [newWidth: number, oldWidth: number, column: TableResolvedColumn<T>, event: MouseEvent];
}>();

const renderColumns = computed(() => props.columns ?? props.store.normalizedColumns.value);
const leafColumns = computed(() => flattenColumns(renderColumns.value));
const headerRows = computed(() => buildHeaderRows(renderColumns.value));

function resolveHeaderRowClassName(rowIndex: number) {
  const className =
    typeof props.headerRowClassName === "function"
      ? props.headerRowClassName(rowIndex)
      : props.headerRowClassName;

  return ["xy-table__header-row", className];
}

function resolveHeaderRowStyle(rowIndex: number) {
  return typeof props.headerRowStyle === "function"
    ? props.headerRowStyle(rowIndex)
    : props.headerRowStyle;
}

function getLeafColumnIndex(column: TableResolvedColumn<T>) {
  return column.leafIndex;
}

function resolveHeaderCellClassName(column: TableResolvedColumn<T>, columnIndex: number) {
  const className =
    typeof props.headerCellClassName === "function"
      ? props.headerCellClassName(column, columnIndex)
      : props.headerCellClassName;
  const sortOrder = props.store.getColumnSortOrder(column);

  return [
    "xy-table__header-cell",
    `is-${column.headerAlign}`,
    column.labelClassName,
    className,
    props.panel !== "main" ? "is-fixed-panel-cell" : "",
    column.sortable ? "is-sortable" : "",
    sortOrder ? "is-sorted" : "",
    props.store.getColumnFilterValues(column).length > 0 ? "is-filtered" : ""
  ];
}

function resolveHeaderCellStyle(column: TableResolvedColumn<T>, columnIndex: number) {
  return typeof props.headerCellStyle === "function"
    ? props.headerCellStyle(column, columnIndex)
    : props.headerCellStyle;
}

function handleHeaderClick(column: TableResolvedColumn<T>, event: MouseEvent) {
  if (column.sortable) {
    props.store.cycleSortOrder(column);
  }

  emit("header-click", column, event);
}

function handleHeaderKeydown(column: TableResolvedColumn<T>, event: KeyboardEvent) {
  if (!column.sortable || props.panel !== "main") {
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    props.store.cycleSortOrder(column);
  }
}

function startResize(column: TableResolvedColumn<T>, event: MouseEvent) {
  if (event.button !== 0 || column.children.length > 0 || !column.resizable) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const startX = event.clientX;
  const startWidth = column.realWidth;

  const handleMouseMove = (moveEvent: MouseEvent) => {
    const nextWidth = startWidth + (moveEvent.clientX - startX);
    props.store.setColumnWidth(column.uid, nextWidth);
  };

  const handleMouseUp = (upEvent: MouseEvent) => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    emit("header-dragend", column.realWidth, startWidth, column, upEvent);
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
}

function shouldRenderFilterPanel(column: TableResolvedColumn<T>) {
  if (!props.store.isFilterPanelOpen(column)) {
    return false;
  }

  if (props.panel === "main") {
    return !column.fixed;
  }

  return column.fixed === props.panel;
}

function resolveColWidth(column: TableResolvedColumn<T>) {
  return {
    width: toCssSize(column.realWidth),
    minWidth: toCssSize(column.realWidth)
  };
}
</script>

<template>
  <table v-if="props.showHeader" class="xy-table__header-table">
    <colgroup>
      <col
        v-for="column in leafColumns"
        :key="column.uid"
        :style="resolveColWidth(column)"
      />
    </colgroup>
    <thead>
      <tr
        v-for="(row, rowIndex) in headerRows"
        :key="`header-row-${rowIndex}`"
        :class="resolveHeaderRowClassName(rowIndex)"
        :style="resolveHeaderRowStyle(rowIndex)"
      >
        <th
          v-for="cell in row"
          :key="cell.column.uid"
          :colspan="cell.colSpan"
          :rowspan="cell.rowSpan"
          :class="resolveHeaderCellClassName(cell.column, getLeafColumnIndex(cell.column))"
          :style="resolveHeaderCellStyle(cell.column, getLeafColumnIndex(cell.column))"
          :aria-sort="
            cell.column.sortable
              ? props.store.getColumnSortOrder(cell.column) === 'ascending'
                ? 'ascending'
                : props.store.getColumnSortOrder(cell.column) === 'descending'
                  ? 'descending'
                  : 'none'
              : undefined
          "
          :tabindex="props.panel === 'main' && cell.column.sortable ? 0 : undefined"
          @click="handleHeaderClick(cell.column, $event)"
          @contextmenu.prevent="emit('header-contextmenu', cell.column, $event)"
          @keydown="handleHeaderKeydown(cell.column, $event)"
        >
          <div class="xy-table__header-cell-inner">
            <template v-if="cell.column.type === 'selection'">
              <xy-checkbox
                :model-value="props.store.isAllSelected.value"
                :indeterminate="props.store.isSelectionIndeterminate.value"
                :aria-label="cell.column.label || '全选'"
                @change="props.store.toggleAllSelection()"
              />
            </template>
            <template v-else>
              <span class="xy-table__header-label">
                <table-render-slot
                  v-if="cell.column.headerSlot"
                  :render="cell.column.headerSlot"
                  :slot-props="{
                    column: cell.column,
                    sortOrder: props.store.getColumnSortOrder(cell.column),
                    filteredValues: props.store.getColumnFilterValues(cell.column)
                  }"
                />
                <template v-else>
                  {{ cell.column.label }}
                </template>
              </span>
            </template>

            <span
              v-if="cell.column.sortable && cell.column.type === 'default'"
              class="xy-table__sort-trigger"
              aria-hidden="true"
            >
              <xy-icon
                class="xy-table__sort-icon"
                :class="{ 'is-active': props.store.getColumnSortOrder(cell.column) === 'ascending' }"
                icon="mdi:chevron-up"
                :size="14"
              />
              <xy-icon
                class="xy-table__sort-icon"
                :class="{ 'is-active': props.store.getColumnSortOrder(cell.column) === 'descending' }"
                icon="mdi:chevron-down"
                :size="14"
              />
            </span>

            <button
              v-if="cell.column.filters.length > 0"
              class="xy-table__filter-trigger"
              :class="{ 'is-active': props.store.getColumnFilterValues(cell.column).length > 0 }"
              type="button"
              @click.stop="props.store.toggleFilterPanel(cell.column)"
            >
              <xy-icon icon="mdi:filter-variant" :size="14" />
            </button>

            <span
              v-if="cell.column.children.length === 0 && cell.column.resizable"
              class="xy-table__resize-handle"
              @mousedown="startResize(cell.column, $event)"
            />
          </div>

          <filter-panel
            v-if="shouldRenderFilterPanel(cell.column)"
            :title="cell.column.label"
            :options="cell.column.filters"
            :selected-values="props.store.getColumnFilterValues(cell.column)"
            :multiple="cell.column.filterMultiple"
            @select="props.store.setColumnFilters(cell.column, $event)"
            @close="props.store.closeFilterPanel()"
          />
        </th>
      </tr>
    </thead>
  </table>
</template>
