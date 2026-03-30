<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, ref } from "vue";
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
    appendFilterPanelTo?: string;
    allowDragLastColumn?: boolean;
    tableWidth?: number;
  }>(),
  {
    columns: undefined,
    panel: "main",
    showHeader: true,
    headerRowClassName: "",
    headerRowStyle: undefined,
    headerCellClassName: "",
    headerCellStyle: undefined,
    appendFilterPanelTo: "",
    allowDragLastColumn: true,
    tableWidth: undefined
  }
);

const emit = defineEmits<{
  "header-dragstart": [left: number];
  "header-dragmove": [left: number];
  "header-click": [column: TableResolvedColumn<T>, event: MouseEvent];
  "header-contextmenu": [column: TableResolvedColumn<T>, event: MouseEvent];
  "header-dragend": [newWidth: number, oldWidth: number, column: TableResolvedColumn<T>, event: MouseEvent];
}>();

const tableRef = ref<HTMLTableElement | null>(null);
const renderColumns = computed(() => props.columns ?? props.store.normalizedColumns.value);
const leafColumns = computed(() => flattenColumns(renderColumns.value));
const headerRows = computed(() => buildHeaderRows(renderColumns.value));
const filterTriggerRefs = new Map<string, HTMLElement | null>();

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
    column.type === "selection" ? "xy-table__column--selection" : "",
    column.type === "expand" ? "xy-table__column--expand" : "",
    className,
    props.panel !== "main" ? "is-fixed-panel-cell" : "",
    ...resolveFixedColumnClassNames(column),
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
  if (event.button !== 0 || !canResizeColumn(column)) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const startCell = (event.currentTarget as HTMLElement | null)?.closest("th");
  const tableElement = startCell?.closest(".xy-table");

  if (!startCell || !tableElement) {
    return;
  }

  const startX = event.clientX;
  const startCellRect = startCell.getBoundingClientRect();
  const tableLeft = tableElement.getBoundingClientRect().left;
  const startWidth = startCellRect.width;
  const oldWidth = Math.round(startWidth);
  const startLeft = startCellRect.right - tableLeft;
  const startColumnLeft = startCellRect.left - tableLeft;
  const minLeft = startColumnLeft + 40;
  const previousCursor = document.body.style.cursor;
  const previousUserSelect = document.body.style.userSelect;

  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
  emit("header-dragstart", startLeft);

  const handleMouseMove = (moveEvent: MouseEvent) => {
    const nextLeft = Math.max(minLeft, startLeft + (moveEvent.clientX - startX));
    emit("header-dragmove", nextLeft);
  };

  const handleMouseUp = (upEvent: MouseEvent) => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = previousCursor;
    document.body.style.userSelect = previousUserSelect;

    const finalLeft = Math.max(minLeft, startLeft + (upEvent.clientX - startX));
    const newWidth = Math.max(40, Math.round(finalLeft - startColumnLeft));
    props.store.setColumnWidth(column.uid, newWidth);
    emit("header-dragend", newWidth, oldWidth, column, upEvent);
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
}

function setFilterTriggerRef(uid: string, element: Element | null) {
  filterTriggerRefs.set(uid, element instanceof HTMLElement ? element : null);
}

function getFilterTriggerRef(uid: string) {
  return filterTriggerRefs.get(uid) ?? null;
}

function isLastLeafColumn(column: TableResolvedColumn<T>) {
  return leafColumns.value[leafColumns.value.length - 1]?.uid === column.uid;
}

function canResizeColumn(column: TableResolvedColumn<T>) {
  if (column.children.length > 0 || !column.resizable) {
    return false;
  }

  if (props.allowDragLastColumn) {
    return true;
  }

  return !isLastLeafColumn(column);
}

function isFixedBoundaryColumn(column: TableResolvedColumn<T>, position: "left" | "right") {
  const boundaryUid =
    position === "left"
      ? leafColumns.value[leafColumns.value.length - 1]?.uid
      : leafColumns.value[0]?.uid;

  if (!boundaryUid) {
    return false;
  }

  return flattenColumns([column]).some((item) => item.uid === boundaryUid);
}

function resolveFixedColumnClassNames(column: TableResolvedColumn<T>) {
  if (props.panel === "main" || !column.fixed) {
    return [];
  }

  if (column.fixed === "left") {
    return [
      "xy-table-fixed-column--left",
      isFixedBoundaryColumn(column, "left") ? "is-last-column" : ""
    ];
  }

  return [
    "xy-table-fixed-column--right",
    isFixedBoundaryColumn(column, "right") ? "is-first-column" : ""
  ];
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
  <table
    v-if="props.showHeader"
    ref="tableRef"
    class="xy-table__header-table"
    :style="resolveTableStyle()"
  >
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
              class="xy-table__caret-wrapper"
              aria-hidden="true"
            >
              <i class="xy-table__sort-caret ascending" />
              <i class="xy-table__sort-caret descending" />
            </span>

            <button
              v-if="cell.column.filters.length > 0"
              :ref="(element) => setFilterTriggerRef(cell.column.uid, element as Element | null)"
              class="xy-table__filter-trigger"
              :class="{
                'is-active':
                  props.store.getColumnFilterValues(cell.column).length > 0 ||
                  props.store.isFilterPanelOpen(cell.column)
              }"
              type="button"
              :aria-label="`${cell.column.label || '当前列'}筛选`"
              :aria-expanded="props.store.isFilterPanelOpen(cell.column)"
              @click.stop="props.store.toggleFilterPanel(cell.column)"
            >
              <xy-icon
                class="xy-table__filter-trigger-icon"
                :icon="
                  props.store.isFilterPanelOpen(cell.column) ? 'mdi:arrow-up' : 'mdi:arrow-down'
                "
                :size="14"
              />
            </button>

            <span
              v-if="canResizeColumn(cell.column)"
              class="xy-table__resize-handle"
              @mousedown="startResize(cell.column, $event)"
            />
          </div>

          <filter-panel
            :open="shouldRenderFilterPanel(cell.column)"
            :options="cell.column.filters"
            :selected-values="props.store.getColumnFilterValues(cell.column)"
            :multiple="cell.column.filterMultiple"
            :placement="cell.column.filterPlacement"
            :append-to="props.appendFilterPanelTo"
            :panel-class="cell.column.filterClassName"
            :reference-el="getFilterTriggerRef(cell.column.uid)"
            @select="props.store.setColumnFilters(cell.column, $event)"
            @close="props.store.closeFilterPanel()"
          />
        </th>
      </tr>
    </thead>
  </table>
</template>
