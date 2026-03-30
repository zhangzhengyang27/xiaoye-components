<script setup lang="ts">
import {
  computed,
  defineComponent,
  h,
  ref,
  useAttrs,
  useSlots,
  type PropType
} from "vue";
import { useNamespace } from "@xiaoye/composables";
import { XyButton, XyPagination, XyTable, XyTableColumn } from "@xiaoye/components";
import type {
  PaginationProps,
  TableFilterValues,
  TableInstance,
  TableSortOrder
} from "@xiaoye/components";
import type {
  ProTableColumn,
  ProTableProps,
  ProTableToolbarAction,
  ProTableSortChangePayload
} from "./pro-table";

defineOptions({
  name: "XyProTable",
  inheritAttrs: false
});

type ProTableRow = Record<string, unknown>;

const props = withDefaults(defineProps<ProTableProps<any>>(), {
  title: "",
  description: "",
  loading: false,
  toolbarActions: () => [],
  tableProps: () => ({}),
  pagination: true,
  currentPage: undefined,
  pageSize: undefined,
  defaultCurrentPage: 1,
  defaultPageSize: 10,
  total: undefined,
  pageSizes: () => [10, 20, 50, 100],
  pageLayout: "total, sizes, ->, prev, pager, next, jumper",
  hideOnSinglePage: false,
  paginationProps: () => ({})
});

const emit = defineEmits<{
  "toolbar-action": [action: ProTableToolbarAction];
  "update:currentPage": [value: number];
  "update:pageSize": [value: number];
  "page-change": [page: number, pageSize: number];
  "row-click": [row: ProTableRow, rowIndex: number, event: MouseEvent | KeyboardEvent];
  "row-dblclick": [row: ProTableRow, rowIndex: number, event: MouseEvent];
  "selection-change": [selection: ProTableRow[]];
  select: [selection: ProTableRow[], row: ProTableRow];
  "select-all": [selection: ProTableRow[]];
  "current-change": [currentRow: ProTableRow | null, oldCurrentRow: ProTableRow | null];
  "sort-change": [payload: { column: unknown; prop: string | undefined; order: TableSortOrder }];
  "filter-change": [value: TableFilterValues];
  "expand-change": [row: ProTableRow, expandedRows: ProTableRow[] | boolean];
}>();

function filterVisibleColumns<TItem extends Record<string, unknown>>(
  columns: ProTableColumn<TItem>[]
): ProTableColumn<TItem>[] {
  return columns
    .filter((column) => !column.hidden)
    .map((column) => ({
      ...column,
      children: column.children ? filterVisibleColumns(column.children) : undefined
    }));
}

function getColumnProps<TItem extends Record<string, unknown>>(column: ProTableColumn<TItem>) {
  const {
    key: _key,
    children: _children,
    slot: _slot,
    headerSlot: _headerSlot,
    hidden: _hidden,
    ...rest
  } = column;

  return rest;
}

function getCellSlotName<TItem extends Record<string, unknown>>(column: ProTableColumn<TItem>) {
  return column.slot ?? column.prop ?? column.key;
}

function getHeaderSlotName<TItem extends Record<string, unknown>>(column: ProTableColumn<TItem>) {
  if (column.headerSlot) {
    return column.headerSlot;
  }

  const baseName = getCellSlotName(column);
  return baseName ? `${baseName}-header` : undefined;
}

const attrs = useAttrs();
const slots = useSlots() as Record<string, ((payload?: unknown) => unknown) | undefined>;
const ns = useNamespace("pro-table");
const tableRef = ref<TableInstance<any> | null>(null);
const visibleColumns = computed(() => filterVisibleColumns(props.columns));
const visibleToolbarActions = computed(() =>
  props.toolbarActions.filter((action) => action.visible !== false)
);
const hasToolbar = computed(
  () =>
    Boolean(props.title) ||
    Boolean(props.description) ||
    visibleToolbarActions.value.length > 0 ||
    Boolean(slots["toolbar-main"]) ||
    Boolean(slots["toolbar-left"]) ||
    Boolean(slots["toolbar-right"])
);
const hasSearch = computed(() => Boolean(slots.search));
const hasFooterMeta = computed(() => Boolean(slots["footer-meta"]));
const rootClasses = computed(() => [ns.base.value, attrs.class]);
const rootStyle = computed(() => [attrs.style]);
const nativeAttrs = computed<Record<string, unknown>>(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});
const tableBindings = computed(() => ({
  ...props.tableProps,
  data: props.data,
  loading: props.loading
}));
const showLoadingState = computed(() => props.loading);
const showEmptyState = computed(() => !showLoadingState.value && props.data.length === 0);
const paginationBindings = computed(() => {
  const merged: Partial<PaginationProps> = {
    ...props.paginationProps
  };

  if (props.currentPage !== undefined) {
    merged.currentPage = props.currentPage;
  }

  if (props.pageSize !== undefined) {
    merged.pageSize = props.pageSize;
  }

  if (merged.defaultCurrentPage === undefined) {
    merged.defaultCurrentPage = props.defaultCurrentPage;
  }

  if (merged.defaultPageSize === undefined) {
    merged.defaultPageSize = props.defaultPageSize;
  }

  if (props.total !== undefined) {
    merged.total = props.total;
  }

  if (merged.pageSizes === undefined) {
    merged.pageSizes = props.pageSizes;
  }

  if (merged.layout === undefined) {
    merged.layout = props.pageLayout;
  }

  if (merged.hideOnSinglePage === undefined) {
    merged.hideOnSinglePage = props.hideOnSinglePage;
  }

  return merged;
});
const showPagination = computed(
  () =>
    props.pagination &&
    (typeof paginationBindings.value.total === "number" ||
      typeof paginationBindings.value.pageCount === "number")
);

const ProTableColumnRenderer = defineComponent({
  name: "XyProTableColumnRenderer",
  props: {
    column: {
      type: Object as PropType<ProTableColumn<any>>,
      required: true
    }
  },
  setup(rendererProps) {
    return () => {
      const column = rendererProps.column;
      const children = column.children ?? [];
      const cellSlotName = getCellSlotName(column);
      const headerSlotName = getHeaderSlotName(column);
      const slotConfig: Record<string, ((payload: unknown) => unknown) | (() => unknown)> = {};

      if (children.length > 0) {
        slotConfig.default = () =>
          children.map((child, index) =>
            h(ProTableColumnRenderer, {
              key: child.key ?? child.prop ?? `${column.key ?? column.prop ?? "column"}-${index}`,
              column: child
            })
          );
      } else if (cellSlotName && slots[cellSlotName]) {
        slotConfig.default = (slotProps) => slots[cellSlotName]?.(slotProps);
      }

      if (headerSlotName && slots[headerSlotName]) {
        slotConfig.header = (slotProps) => slots[headerSlotName]?.(slotProps);
      }

      return h(XyTableColumn, getColumnProps(column), slotConfig);
    };
  }
});

function emitToolbarAction(action: ProTableToolbarAction) {
  emit("toolbar-action", action);
}

function handleCurrentPageUpdate(value: number) {
  emit("update:currentPage", value);
}

function handlePageSizeUpdate(value: number) {
  emit("update:pageSize", value);
}

function handlePageChange(page: number, pageSize: number) {
  emit("page-change", page, pageSize);
}

function handleRowClick(row: ProTableRow, rowIndex: number, event: MouseEvent | KeyboardEvent) {
  emit("row-click", row, rowIndex, event);
}

function handleRowDblClick(row: ProTableRow, rowIndex: number, event: MouseEvent) {
  emit("row-dblclick", row, rowIndex, event);
}

function handleSelectionChange(selection: ProTableRow[]) {
  emit("selection-change", selection);
}

function handleSelect(selection: ProTableRow[], row: ProTableRow) {
  emit("select", selection, row);
}

function handleSelectAll(selection: ProTableRow[]) {
  emit("select-all", selection);
}

function handleCurrentChange(currentRow: ProTableRow | null, oldCurrentRow: ProTableRow | null) {
  emit("current-change", currentRow, oldCurrentRow);
}

function handleSortChange(payload: {
  column: unknown;
  prop: string | undefined;
  order: TableSortOrder;
}) {
  emit("sort-change", payload as ProTableSortChangePayload<ProTableRow>);
}

function handleFilterChange(value: TableFilterValues) {
  emit("filter-change", value);
}

function handleExpandChange(row: ProTableRow, expandedRows: ProTableRow[] | boolean) {
  emit("expand-change", row, expandedRows);
}

defineExpose({
  clearSelection: () => tableRef.value?.clearSelection(),
  getSelectionRows: () => tableRef.value?.getSelectionRows() ?? [],
  toggleAllSelection: () => tableRef.value?.toggleAllSelection(),
  toggleRowSelection: (row: ProTableRow, selected?: boolean) =>
    tableRef.value?.toggleRowSelection(row, selected),
  toggleRowExpansion: (row: ProTableRow, expanded?: boolean) =>
    tableRef.value?.toggleRowExpansion(row, expanded),
  setCurrentRow: (row?: ProTableRow | null) => tableRef.value?.setCurrentRow(row),
  clearSort: () => tableRef.value?.clearSort(),
  clearFilter: (columnKeys?: string | string[]) => tableRef.value?.clearFilter(columnKeys),
  sort: (prop: string, order: TableSortOrder) => tableRef.value?.sort(prop, order),
  doLayout: () => tableRef.value?.doLayout(),
  refreshLayout: () => tableRef.value?.doLayout(),
  scrollTo: (options: ScrollToOptions | number, top?: number) =>
    tableRef.value?.scrollTo(options, top),
  setScrollTop: (top: number) => tableRef.value?.setScrollTop(top),
  setScrollLeft: (left: number) => tableRef.value?.setScrollLeft(left)
});
</script>

<template>
  <div :class="rootClasses" :style="rootStyle" v-bind="nativeAttrs">
    <div v-if="hasToolbar" class="xy-pro-table__toolbar">
      <div class="xy-pro-table__toolbar-main">
        <slot name="toolbar-main">
          <h3 v-if="props.title" class="xy-pro-table__title">{{ props.title }}</h3>
          <p v-if="props.description" class="xy-pro-table__description">
            {{ props.description }}
          </p>
        </slot>
      </div>
      <div
        v-if="visibleToolbarActions.length > 0 || slots['toolbar-left'] || slots['toolbar-right']"
        class="xy-pro-table__toolbar-extra"
      >
        <slot name="toolbar-left" />
        <xy-button
          v-for="action in visibleToolbarActions"
          :key="action.key"
          :type="action.type"
          :plain="action.plain"
          :text="action.text"
          :link="action.link"
          :disabled="action.disabled"
          :loading="action.loading"
          :icon="action.icon"
          @click="emitToolbarAction(action)"
        >
          {{ action.label }}
        </xy-button>
        <slot name="toolbar-right" />
      </div>
    </div>

    <div v-if="hasSearch" class="xy-pro-table__search">
      <slot name="search" />
    </div>

    <div class="xy-pro-table__table">
      <xy-table
        ref="tableRef"
        v-bind="tableBindings"
        @row-click="handleRowClick"
        @row-dblclick="handleRowDblClick"
        @selection-change="handleSelectionChange"
        @select="handleSelect"
        @select-all="handleSelectAll"
        @current-change="handleCurrentChange"
        @sort-change="handleSortChange"
        @filter-change="handleFilterChange"
        @expand-change="handleExpandChange"
      >
        <template v-if="slots.loading" #loading>
          <slot name="loading" :loading="showLoadingState" />
        </template>
        <template v-if="slots.empty" #empty>
          <slot name="empty" :empty="showEmptyState" />
        </template>
        <ProTableColumnRenderer
          v-for="visibleColumn in visibleColumns"
          :key="visibleColumn.key ?? visibleColumn.prop ?? visibleColumn.label"
          :column="visibleColumn"
        />
      </xy-table>
    </div>

    <div v-if="showPagination || hasFooterMeta" class="xy-pro-table__footer">
      <div class="xy-pro-table__footer-meta">
        <slot name="footer-meta" />
      </div>
      <xy-pagination
        v-if="showPagination"
        class="xy-pro-table__pagination"
        v-bind="paginationBindings"
        @update:current-page="handleCurrentPageUpdate"
        @update:page-size="handlePageSizeUpdate"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>
