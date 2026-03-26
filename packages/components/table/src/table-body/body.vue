<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed } from "vue";
import XyCheckbox from "../../../checkbox";
import XyIcon from "../../../icon";
import TableCellText from "../table-cell-text.vue";
import { TableRenderSlot } from "../render-slot";
import { TableRenderValue } from "../render-value";
import type {
  TableCellClassName,
  TableCellSlotProps,
  TableCellStyle,
  TableResolvedColumn,
  TableRowClassName,
  TableRowStyle,
  TableTreeNode
} from "../table";
import { isPrimitiveTableValue, toCssSize } from "../table";
import type { TableStore } from "../store";
import { flattenColumns, normalizeSpanResult } from "../util";

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
    expandedRowMode?: ExpandedRowMode;
    mainTableWidth?: number;
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
    expandedRowMode: "content",
    mainTableWidth: undefined
  }
);

const emit = defineEmits<{
  "row-click": [row: T, rowIndex: number, event: MouseEvent | KeyboardEvent];
  "row-dblclick": [row: T, rowIndex: number, event: MouseEvent];
  "row-contextmenu": [row: T, rowIndex: number, event: MouseEvent];
  "cell-click": [row: T, column: TableResolvedColumn<T>, cell: HTMLTableCellElement, event: MouseEvent];
  "cell-dblclick": [row: T, column: TableResolvedColumn<T>, cell: HTMLTableCellElement, event: MouseEvent];
  "cell-contextmenu": [row: T, column: TableResolvedColumn<T>, cell: HTMLTableCellElement, event: MouseEvent];
  "cell-mouse-enter": [row: T, column: TableResolvedColumn<T>, cell: HTMLTableCellElement, event: MouseEvent];
  "cell-mouse-leave": [row: T, column: TableResolvedColumn<T>, cell: HTMLTableCellElement, event: MouseEvent];
}>();

const leafColumns = computed(() => flattenColumns(props.columns ?? props.store.normalizedColumns.value));
const treeColumnUid = computed(() => props.store.treeColumn.value?.uid);
const expandColumn = computed(() => leafColumns.value.find((column) => column.type === "expand"));
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

function resolveRowClassName(row: T, rowIndex: number) {
  const className =
    typeof props.rowClassName === "function" ? props.rowClassName(row, rowIndex) : props.rowClassName;

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
  return typeof props.rowStyle === "function" ? props.rowStyle(row, rowIndex) : props.rowStyle;
}

function resolveCellClassName(cell: RenderCell<T>) {
  const className =
    typeof props.cellClassName === "function" ? props.cellClassName(cell.meta) : props.cellClassName;

  return [
    "xy-table__cell",
    `is-${cell.column.align}`,
    cell.column.className,
    className,
    props.panel !== "main" ? "is-fixed-panel-cell" : ""
  ];
}

function resolveCellStyle(cell: RenderCell<T>) {
  return typeof props.cellStyle === "function" ? props.cellStyle(cell.meta) : props.cellStyle;
}

function resolveTooltipContent(meta: TableCellSlotProps<T>) {
  return props.tooltipFormatter
    ? props.tooltipFormatter({
        ...meta,
        cellValue: meta.value
      })
    : meta.value;
}

function handleRowClick(row: T, rowIndex: number, event: MouseEvent | KeyboardEvent) {
  if (props.highlightCurrentRow) {
    props.store.setCurrentRow(row);
  }

  emit("row-click", row, rowIndex, event);
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

function handleCellClick(row: T, column: TableResolvedColumn<T>, event: MouseEvent) {
  emit("cell-click", row, column, event.currentTarget as HTMLTableCellElement, event);
}

function handleCellDblclick(row: T, column: TableResolvedColumn<T>, event: MouseEvent) {
  emit("cell-dblclick", row, column, event.currentTarget as HTMLTableCellElement, event);
}

function handleCellContextmenu(row: T, column: TableResolvedColumn<T>, event: MouseEvent) {
  emit("cell-contextmenu", row, column, event.currentTarget as HTMLTableCellElement, event);
}

function handleCellMouseEnter(row: T, column: TableResolvedColumn<T>, event: MouseEvent) {
  emit("cell-mouse-enter", row, column, event.currentTarget as HTMLTableCellElement, event);
}

function handleCellMouseLeave(row: T, column: TableResolvedColumn<T>, event: MouseEvent) {
  emit("cell-mouse-leave", row, column, event.currentTarget as HTMLTableCellElement, event);
}

function shouldRenderExpandedRow(row: T, rowIndex: number) {
  if (!expandColumn.value || props.expandedRowMode === "none") {
    return false;
  }

  return props.store.isRowExpanded(row) && props.store.isRowExpandable(row, rowIndex);
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
  if (props.expandedRowMode !== "placeholder" || props.mainTableWidth === undefined) {
    return undefined;
  }

  return {
    width: toCssSize(props.mainTableWidth)
  };
}
</script>

<template>
  <table class="xy-table__body-table">
    <colgroup>
      <col
        v-for="column in leafColumns"
        :key="column.uid"
        :style="{ width: toCssSize(column.realWidth), minWidth: toCssSize(column.realWidth) }"
      />
    </colgroup>
    <tbody v-if="renderRows.length > 0">
      <template v-for="rowState in renderRows" :key="rowState.item.key">
        <tr
          :class="resolveRowClassName(rowState.item.row, rowState.item.rowIndex)"
          :style="resolveRowStyle(rowState.item.row, rowState.item.rowIndex)"
          :tabindex="props.clickable && props.panel === 'main' ? 0 : undefined"
          @click="handleRowClick(rowState.item.row, rowState.item.rowIndex, $event)"
          @dblclick="emit('row-dblclick', rowState.item.row, rowState.item.rowIndex, $event)"
          @contextmenu.prevent="emit('row-contextmenu', rowState.item.row, rowState.item.rowIndex, $event)"
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
                    @change="props.store.toggleRowSelection(rowState.item.row)"
                  />
                </template>

                <template v-else-if="cell.column.type === 'expand'">
                  <button
                    v-if="props.store.isRowExpandable(rowState.item.row, rowState.item.rowIndex)"
                    class="xy-table__expand-trigger"
                    type="button"
                    @click.stop="props.store.toggleRowExpansion(rowState.item.row)"
                  >
                    <xy-icon
                      :icon="
                        props.store.isRowExpanded(rowState.item.row)
                          ? 'mdi:chevron-down'
                          : 'mdi:chevron-right'
                      "
                      :size="16"
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
                      type="button"
                      @click.stop="props.store.toggleTreeRow(rowState.item.row)"
                    >
                      <xy-icon
                        :icon="
                          rowState.item.treeNode.expanded
                            ? 'mdi:chevron-down'
                            : 'mdi:chevron-right'
                        "
                        :size="16"
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
                    :show-tooltip="cell.column.showOverflowTooltip"
                  />
                  <table-render-value v-else :value="cell.meta.value" />
                </template>
              </div>
            </td>
          </template>
        </tr>

        <tr
          v-if="shouldRenderExpandedRow(rowState.item.row, rowState.item.rowIndex)"
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
                v-if="expandColumn?.cellSlot"
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
