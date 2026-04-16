<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, ref, watch } from "vue";
import XyCheckbox from "../../../checkbox";
import XyIcon from "../../../icon";
import TableCellText from "../table-cell-text.vue";
import { TableRenderSlot } from "../render-slot";
import { TableRenderValue } from "../render-value";
import type {
  TableCellClassName,
  TableCellSlotProps,
  TableCellStyle,
  TableExpandSlotProps,
  TableHeaderCell,
  TableResolvedColumn,
  TableRowClassName,
  TableRowStyle,
  TableTreeNode
} from "../table";
import { isPrimitiveTableValue, prefersObjectCallbackSignature, toCssSize } from "../table";
import type { TableStore } from "../store";
import { buildHeaderRows, flattenColumns, normalizeSpanResult } from "../util";

type TablePanel = "main" | "left" | "right";
type ExpandedRowMode = "content" | "placeholder" | "none";

interface RenderCell<T = Record<string, unknown>> {
  column: TableResolvedColumn<T>;
  columnIndex: number;
  meta: TableCellSlotProps<T>;
  span: {
    rowspan: number;
    colspan: number;
  };
  skip: boolean;
}

const props = withDefaults(
  defineProps<{
    store: TableStore<T>;
    columns?: TableResolvedColumn<T>[];
    panel?: TablePanel;
    rowClassName?: TableRowClassName<T>;
    rowStyle?: TableRowStyle<T>;
    cellClassName?: TableCellClassName<T>;
    cellStyle?: TableCellStyle<T>;
    clickable?: boolean;
    striped?: boolean;
    highlightCurrentRow?: boolean;
    indent?: number;
    spanMethod?: (
      context: {
        row: T;
        rowIndex: number;
        column: TableResolvedColumn<T>;
        columnIndex: number;
      }
    ) => [number, number] | { rowspan: number; colspan: number } | undefined;
    tooltipFormatter?: (
      context: TableCellSlotProps<T> & {
        cellValue: unknown;
      }
    ) => unknown;
    tableWidth?: number;
    expandedRowMode?: ExpandedRowMode;
    mainTableWidth?: number;
    leftFixedWidth?: number;
    rightFixedWidth?: number;
    preserveExpandedContent?: boolean;
    tableLayout?: "fixed" | "auto";
    showHeader?: boolean;
  }>(),
  {
    columns: undefined,
    panel: "main",
    rowClassName: "",
    rowStyle: undefined,
    cellClassName: "",
    cellStyle: undefined,
    clickable: false,
    striped: false,
    highlightCurrentRow: false,
    indent: 16,
    spanMethod: undefined,
    tooltipFormatter: undefined,
    tableWidth: undefined,
    expandedRowMode: "content",
    mainTableWidth: undefined,
    leftFixedWidth: 0,
    rightFixedWidth: 0,
    preserveExpandedContent: false,
    tableLayout: "fixed",
    showHeader: true
  }
);

const emit = defineEmits<{
  "row-click": [row: T, column: TableResolvedColumn<T> | undefined, event: MouseEvent | KeyboardEvent];
  "row-dblclick": [row: T, column: TableResolvedColumn<T> | undefined, event: MouseEvent];
  "row-contextmenu": [row: T, column: TableResolvedColumn<T> | undefined, event: MouseEvent];
  "cell-click": [row: T, column: TableResolvedColumn<T>, cell: HTMLTableCellElement, event: MouseEvent];
  "cell-dblclick": [row: T, column: TableResolvedColumn<T>, cell: HTMLTableCellElement, event: MouseEvent];
  "cell-contextmenu": [row: T, column: TableResolvedColumn<T>, cell: HTMLTableCellElement, event: MouseEvent];
  "cell-mouse-enter": [row: T, column: TableResolvedColumn<T>, cell: HTMLTableCellElement, event: MouseEvent];
  "cell-mouse-leave": [row: T, column: TableResolvedColumn<T>, cell: HTMLTableCellElement, event: MouseEvent];
}>();

const tableRef = ref<HTMLTableElement | null>(null);
const leafColumns = computed(() => flattenColumns(props.columns ?? props.store.normalizedColumns.value));
const headerRows = computed<TableHeaderCell<T>[][]>(() =>
  buildHeaderRows(props.columns ?? props.store.normalizedColumns.value)
);
const treeColumnUid = computed(() => props.store.treeColumn.value?.uid);
const expandColumn = computed(() => leafColumns.value.find((column) => column.type === "expand"));
const preservedExpandedRowKeys = ref(new Set<string | number>());
const shouldUseAutoColgroup = computed(
  () =>
    props.panel !== "main" ||
    props.tableLayout !== "auto" ||
    (props.showHeader && props.store.hasAutoColumnWidths.value)
);
const shouldRenderSizingHeader = computed(
  () => props.panel === "main" && props.tableLayout === "auto" && props.showHeader
);
const renderRows = computed(() => {
  const skipped = new Set<string>();

  return props.store.bodyRows.value.map((item) => {
    const cells: RenderCell<T>[] = [];

    leafColumns.value.forEach((column, columnIndex) => {
      const skipKey = `${item.rowIndex}:${columnIndex}`;

      if (skipped.has(skipKey)) {
        cells.push({
          column,
          columnIndex,
          meta: props.store.getCellMeta(item.row, item.rowIndex, column, columnIndex, item.expanded, item.treeNode),
          span: {
            rowspan: 0,
            colspan: 0
          },
          skip: true
        });
        return;
      }

      const meta = props.store.getCellMeta(
        item.row,
        item.rowIndex,
        column,
        columnIndex,
        item.expanded,
        item.treeNode
      );
      const span = normalizeSpanResult(props.spanMethod, {
        row: item.row,
        rowIndex: item.rowIndex,
        column,
        columnIndex
      });
      const normalizedSpan = {
        rowspan: Math.max(0, span.rowspan),
        colspan: Math.max(0, span.colspan)
      };

      if (normalizedSpan.rowspan === 0 || normalizedSpan.colspan === 0) {
        cells.push({
          column,
          columnIndex,
          meta,
          span: normalizedSpan,
          skip: true
        });
        return;
      }

      for (let rowOffset = 0; rowOffset < normalizedSpan.rowspan; rowOffset += 1) {
        for (let columnOffset = 0; columnOffset < normalizedSpan.colspan; columnOffset += 1) {
          if (rowOffset === 0 && columnOffset === 0) {
            continue;
          }

          skipped.add(`${item.rowIndex + rowOffset}:${columnIndex + columnOffset}`);
        }
      }

      cells.push({
        column,
        columnIndex,
        meta,
        span: normalizedSpan,
        skip: false
      });
    });

    return {
      item,
      cells
    };
  });
});

watch(
  () => props.store.bodyRows.value.map((item) => `${String(item.key)}:${item.expanded ? 1 : 0}`).join("|"),
  () => {
    if (!props.preserveExpandedContent) {
      if (preservedExpandedRowKeys.value.size > 0) {
        preservedExpandedRowKeys.value = new Set();
      }
      return;
    }

    const rows = props.store.bodyRows.value;
    const availableKeys = new Set(rows.map((item) => item.key));
    const nextPreservedKeys = new Set(
      [...preservedExpandedRowKeys.value].filter((key) => availableKeys.has(key))
    );

    rows.forEach((item) => {
      if (item.expanded) {
        nextPreservedKeys.add(item.key);
      }
    });

    const hasChanged =
      nextPreservedKeys.size !== preservedExpandedRowKeys.value.size ||
      [...nextPreservedKeys].some((key) => !preservedExpandedRowKeys.value.has(key));

    if (hasChanged) {
      preservedExpandedRowKeys.value = nextPreservedKeys;
    }
  },
  {
    immediate: true
  }
);

function resolveRowClassName(row: T, rowIndex: number) {
  const callback = props.rowClassName as any;
  const className =
    typeof props.rowClassName === "function"
      ? prefersObjectCallbackSignature(callback)
        ? callback({
            row,
            rowIndex
          })
        : callback(row, rowIndex)
      : props.rowClassName;

  return [
    "xy-table__row",
    className,
    props.striped && rowIndex % 2 === 1 ? "is-striped" : "",
    props.highlightCurrentRow && props.store.isCurrentRow(row, rowIndex) ? "is-current" : "",
    props.store.isHoveredRow(row) ? "is-hover" : "",
    props.clickable ? "is-clickable" : ""
  ];
}

function resolveRowStyle(row: T, rowIndex: number) {
  const callback = props.rowStyle as any;
  return typeof props.rowStyle === "function"
    ? prefersObjectCallbackSignature(callback)
      ? callback({
          row,
          rowIndex
        })
      : callback(row, rowIndex)
    : props.rowStyle;
}

function resolveCellClassName(cell: RenderCell<T>) {
  const className =
    typeof props.cellClassName === "function" ? props.cellClassName(cell.meta) : props.cellClassName;
  const endsAtLastBodyRow =
    cell.span.rowspan > 1 && cell.meta.rowIndex + cell.span.rowspan >= renderRows.value.length;

  return [
    "xy-table__cell",
    `is-${cell.column.align}`,
    cell.column.type === "selection" ? "xy-table__column--selection" : "",
    cell.column.type === "expand" ? "xy-table__column--expand" : "",
    cell.column.className,
    className,
    endsAtLastBodyRow ? "is-rowspan-tail" : "",
    props.panel !== "main" ? "is-fixed-panel-cell" : "",
    ...resolveFixedColumnClassNames(cell.column)
  ];
}

function resolveCellStyle(cell: RenderCell<T>) {
  return typeof props.cellStyle === "function" ? props.cellStyle(cell.meta) : props.cellStyle;
}

function resolveTooltipContent(meta: TableCellSlotProps<T>) {
  const formatter = meta.column.tooltipFormatter ?? props.tooltipFormatter;

  return formatter
    ? formatter({
        ...meta,
        cellValue: meta.value
      })
    : meta.value;
}

function handleRowClick(row: T, rowIndex: number, event: MouseEvent | KeyboardEvent) {
  if (props.highlightCurrentRow) {
    props.store.setCurrentRow(row);
  }

  emit("row-click", row, resolveRowEventColumn(event), event);
}

function handleRowKeydown(row: T, rowIndex: number, event: KeyboardEvent) {
  if (!props.clickable || props.panel !== "main") {
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handleRowClick(row, rowIndex, event);
  }
}

function isTreeColumn(column: TableResolvedColumn<T>) {
  return column.uid === treeColumnUid.value;
}

function hasTreeTrigger(treeNode?: TableTreeNode) {
  return Boolean(treeNode?.hasChildren);
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

function handleCellClick(row: T, column: TableResolvedColumn<T>, event: MouseEvent) {
  emit("row-click", row, column, event);
  emit("cell-click", row, column, event.currentTarget as HTMLTableCellElement, event);
}

function handleCellDblclick(row: T, column: TableResolvedColumn<T>, event: MouseEvent) {
  emit("row-dblclick", row, column, event);
  emit("cell-dblclick", row, column, event.currentTarget as HTMLTableCellElement, event);
}

function handleCellContextmenu(row: T, column: TableResolvedColumn<T>, event: MouseEvent) {
  emit("row-contextmenu", row, column, event);
  emit("cell-contextmenu", row, column, event.currentTarget as HTMLTableCellElement, event);
}

function handleCellMouseEnter(row: T, column: TableResolvedColumn<T>, event: MouseEvent) {
  emit("cell-mouse-enter", row, column, event.currentTarget as HTMLTableCellElement, event);
}

function handleCellMouseLeave(row: T, column: TableResolvedColumn<T>, event: MouseEvent) {
  emit("cell-mouse-leave", row, column, event.currentTarget as HTMLTableCellElement, event);
}

function resolveRowEventColumn(event: MouseEvent | KeyboardEvent) {
  const target = event.target;

  if (!(target instanceof Element)) {
    return undefined;
  }

  const cell = target.closest<HTMLTableCellElement>("td[data-column-uid]");
  const uid = cell?.dataset.columnUid;

  if (!uid) {
    return undefined;
  }

  return leafColumns.value.find((column) => column.uid === uid);
}

function shouldRenderExpandedRow(row: T, rowIndex: number) {
  if (props.expandedRowMode === "none") {
    return false;
  }

  if (props.expandedRowMode === "content" && !expandColumn.value) {
    return false;
  }

  const record = props.store.getRowKey(row, rowIndex);

  if (!props.store.isRowExpandable(row, rowIndex)) {
    return false;
  }

  if (props.store.isRowExpanded(row)) {
    return true;
  }

  return props.preserveExpandedContent && preservedExpandedRowKeys.value.has(record);
}

function getExpandedRowId(row: T, rowIndex: number) {
  return `xy-table-expanded-row-${String(props.store.getRowKey(row, rowIndex))}`;
}

function getExpandColumnIndex() {
  return leafColumns.value.findIndex((column) => column.uid === expandColumn.value?.uid);
}

function getExpandedSlotProps(row: T, rowIndex: number, treeNode: TableTreeNode) {
  if (!expandColumn.value) {
    return undefined;
  }

  return props.store.getCellMeta(
    row,
    rowIndex,
    expandColumn.value,
    getExpandColumnIndex(),
    true,
    treeNode
  );
}

function resolveExpandedContentStyle() {
  if (props.expandedRowMode === "placeholder") {
    if (props.mainTableWidth === undefined) {
      return undefined;
    }

    return {
      width: toCssSize(props.mainTableWidth)
    };
  }

  if (props.panel !== "main") {
    return undefined;
  }

  return {
    paddingLeft: props.leftFixedWidth > 0 ? toCssSize(props.leftFixedWidth) : undefined,
    paddingRight: props.rightFixedWidth > 0 ? toCssSize(props.rightFixedWidth) : undefined
  };
}

function getExpandSlotProps(row: T, rowIndex: number, treeNode: TableTreeNode): TableExpandSlotProps<T> {
  const meta = getExpandedSlotProps(row, rowIndex, treeNode);

  if (!meta) {
    throw new Error("expand slot requires an expand column");
  }

  return {
    ...meta,
    expanded: props.store.isRowExpanded(row),
    expandable: props.store.isRowExpandable(row, rowIndex)
  };
}

function isExpandedRowVisible(row: T) {
  return props.store.isRowExpanded(row);
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
  <table ref="tableRef" class="xy-table__body-table" :style="resolveTableStyle()">
    <colgroup v-if="shouldUseAutoColgroup">
      <col
        v-for="column in leafColumns"
        :key="column.uid"
        :style="{ width: toCssSize(column.realWidth), minWidth: toCssSize(column.realWidth) }"
      />
    </colgroup>
    <thead v-if="shouldRenderSizingHeader" class="xy-table__body-sizing-header" aria-hidden="true">
      <tr
        v-for="(row, rowIndex) in headerRows"
        :key="`body-sizing-header-row-${rowIndex}`"
        class="xy-table__header-row xy-table__header-row--sizing"
      >
        <th
          v-for="cell in row"
          :key="cell.column.uid"
          :colspan="cell.colSpan"
          :rowspan="cell.rowSpan"
          class="xy-table__header-cell xy-table__header-cell--sizing"
          :data-column-uid="cell.column.children.length === 0 ? cell.column.uid : undefined"
        >
          <div class="xy-table__header-cell-inner">
            <template v-if="cell.column.type === 'selection'">
              <xy-checkbox :model-value="false" aria-label="全选" />
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
                <table-render-slot
                  v-else-if="cell.column.renderHeader"
                  :render="cell.column.renderHeader"
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
          </div>
        </th>
      </tr>
    </thead>
    <tbody v-if="renderRows.length > 0">
      <template v-for="rowState in renderRows" :key="rowState.item.key">
        <tr
          :class="resolveRowClassName(rowState.item.row, rowState.item.rowIndex)"
          :style="resolveRowStyle(rowState.item.row, rowState.item.rowIndex)"
          :tabindex="props.clickable && props.panel === 'main' ? 0 : undefined"
          @click="handleRowClick(rowState.item.row, rowState.item.rowIndex, $event)"
          @dblclick="emit('row-dblclick', rowState.item.row, resolveRowEventColumn($event), $event)"
          @contextmenu.prevent="emit('row-contextmenu', rowState.item.row, resolveRowEventColumn($event), $event)"
          @keydown="handleRowKeydown(rowState.item.row, rowState.item.rowIndex, $event)"
          @mouseenter="props.store.setHoveredRow(rowState.item.row)"
          @mouseleave="props.store.setHoveredRow(null)"
        >
          <template v-for="cell in rowState.cells" :key="cell.column.uid">
            <td
              v-if="!cell.skip"
              :colspan="cell.span.colspan"
              :rowspan="cell.span.rowspan"
              :class="resolveCellClassName(cell)"
              :data-column-uid="cell.span.colspan === 1 && cell.span.rowspan > 0 ? cell.column.uid : undefined"
              :style="resolveCellStyle(cell)"
              @click.stop="handleCellClick(rowState.item.row, cell.column, $event)"
              @dblclick.stop="handleCellDblclick(rowState.item.row, cell.column, $event)"
              @contextmenu.prevent.stop="handleCellContextmenu(rowState.item.row, cell.column, $event)"
              @mouseenter="handleCellMouseEnter(rowState.item.row, cell.column, $event)"
              @mouseleave="handleCellMouseLeave(rowState.item.row, cell.column, $event)"
            >
              <div class="xy-table__cell-inner">
                <template v-if="cell.column.type === 'selection'">
                  <xy-checkbox
                    :model-value="props.store.isRowSelected(rowState.item.row)"
                    :indeterminate="props.store.isRowSelectionIndeterminate(rowState.item.row)"
                    aria-label="选择当前行"
                    @change="props.store.toggleRowSelection(rowState.item.row, undefined, false)"
                  />
                </template>

                <template v-else-if="cell.column.type === 'expand'">
                  <button
                    v-if="props.store.isRowExpandable(rowState.item.row, rowState.item.rowIndex)"
                    class="xy-table__expand-trigger"
                    :class="{ 'is-expanded': props.store.isRowExpanded(rowState.item.row) }"
                    type="button"
                    :aria-label="
                      props.store.isRowExpanded(rowState.item.row) ? '收起当前行' : '展开当前行'
                    "
                    :aria-expanded="props.store.isRowExpanded(rowState.item.row)"
                    :aria-controls="
                      props.panel === 'main'
                        ? getExpandedRowId(rowState.item.row, rowState.item.rowIndex)
                        : undefined
                    "
                    @click.stop="props.store.toggleRowExpansion(rowState.item.row)"
                  >
                      <xy-icon
                        class="xy-table__expand-icon"
                        icon="mdi:chevron-right"
                        :size="12"
                      />
                  </button>
                  <span v-else class="xy-table__expand-placeholder" />
                </template>

                <template v-else>
                  <span
                    v-if="props.store.hasTree.value && isTreeColumn(cell.column)"
                    class="xy-table__tree-prefix"
                  >
                    <span
                      class="xy-table__tree-indent"
                      :style="{ width: `${rowState.item.treeNode.level * props.indent}px` }"
                    />
                    <button
                      v-if="hasTreeTrigger(rowState.item.treeNode)"
                      class="xy-table__tree-toggle"
                      :class="{
                        'is-expanded': rowState.item.treeNode.expanded,
                        'is-loading': rowState.item.treeNode.loading
                      }"
                      type="button"
                      :aria-label="
                        rowState.item.treeNode.expanded ? '收起树节点' : '展开树节点'
                      "
                      :aria-expanded="rowState.item.treeNode.expanded"
                      :aria-busy="rowState.item.treeNode.loading || undefined"
                      @click.stop="props.store.toggleTreeRow(rowState.item.row)"
                    >
                      <xy-icon
                        class="xy-table__expand-icon"
                        :icon="rowState.item.treeNode.loading ? 'mdi:loading' : 'mdi:chevron-right'"
                        :size="12"
                      />
                    </button>
                    <span v-else class="xy-table__tree-placeholder" />
                  </span>

                  <table-render-slot
                    v-if="cell.column.cellSlot"
                    :render="cell.column.cellSlot"
                    :slot-props="cell.meta"
                  />
                  <table-cell-text
                    v-else-if="isPrimitiveTableValue(cell.meta.value)"
                    :content="cell.meta.value"
                    :tooltip-content="resolveTooltipContent(cell.meta)"
                    :tooltip-options="cell.column.overflowTooltipOptions"
                  />
                  <table-render-value v-else :value="cell.meta.value" />
                </template>
              </div>
            </td>
          </template>
        </tr>

        <tr
          v-if="shouldRenderExpandedRow(rowState.item.row, rowState.item.rowIndex)"
          v-show="isExpandedRowVisible(rowState.item.row)"
          :id="
            props.panel === 'main'
              ? getExpandedRowId(rowState.item.row, rowState.item.rowIndex)
              : undefined
          "
          class="xy-table__expanded-row"
          :class="{ 'is-placeholder': props.expandedRowMode === 'placeholder' }"
        >
          <td class="xy-table__expanded-cell" :colspan="leafColumns.length">
            <div
              class="xy-table__expanded-content"
              :class="{ 'is-placeholder': props.expandedRowMode === 'placeholder' }"
              :style="resolveExpandedContentStyle()"
            >
              <table-render-slot
                v-if="expandColumn?.expandSlot"
                :render="expandColumn.expandSlot"
                :slot-props="getExpandSlotProps(rowState.item.row, rowState.item.rowIndex, rowState.item.treeNode)"
              />
              <table-render-slot
                v-else-if="expandColumn?.cellSlot"
                :render="expandColumn.cellSlot"
                :slot-props="getExpandedSlotProps(rowState.item.row, rowState.item.rowIndex, rowState.item.treeNode)"
              />
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
