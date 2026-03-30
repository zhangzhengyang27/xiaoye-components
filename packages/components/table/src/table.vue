<script setup lang="ts" generic="T extends Record<string, unknown>">
import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  useAttrs,
  watch
} from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import XyEmpty from "../../empty";
import { XyLoadingIndicator, resolveLoadingVisualConfig } from "../../loading/src/shared";
import TableBody from "./table-body/body.vue";
import TableFooter from "./table-footer/footer.vue";
import TableHeader from "./table-header/header.vue";
import { tableContextKey } from "./tokens";
import type {
  TableFilterValues,
  TableInstance,
  TableProps,
  TableResolvedColumn,
  TableSortOrder
} from "./table";
import { toCssSize } from "./table";
import { useTableLayout, type TableLayoutState } from "./table-layout";
import { useTableStore } from "./store";
import { useTableColumns } from "./use-table-columns";

defineOptions({
  name: "XyTable",
  inheritAttrs: false
});

const props = withDefaults(defineProps<TableProps<T>>(), {
  loading: false,
  size: "md",
  width: undefined,
  height: undefined,
  maxHeight: undefined,
  fit: true,
  stripe: undefined,
  striped: undefined,
  border: undefined,
  bordered: undefined,
  emptyText: "暂无数据",
  loadingText: "Loading...",
  rowKey: undefined,
  showHeader: true,
  showSummary: false,
  sumText: "合计",
  summaryMethod: undefined,
  rowClassName: "",
  rowStyle: undefined,
  cellClassName: "",
  cellStyle: undefined,
  headerRowClassName: "",
  headerRowStyle: undefined,
  headerCellClassName: "",
  headerCellStyle: undefined,
  className: "",
  style: undefined,
  clickable: false,
  highlightCurrentRow: false,
  currentRowKey: undefined,
  defaultCurrentRowKey: null,
  sortProp: undefined,
  sortOrder: undefined,
  defaultSort: () => ({
    prop: undefined,
    order: null
  }),
  filterValues: undefined,
  defaultFilterValues: () => ({}),
  expandRowKeys: undefined,
  defaultExpandAll: false,
  rowExpandable: undefined,
  spanMethod: undefined,
  selectOnIndeterminate: true,
  indent: 16,
  treeProps: undefined,
  lazy: false,
  load: undefined,
  tableLayout: "fixed",
  scrollbarAlwaysOn: false,
  scrollbarTabindex: undefined,
  showOverflowTooltip: false,
  tooltipEffect: undefined,
  tooltipOptions: undefined,
  tooltipFormatter: undefined,
  appendFilterPanelTo: "",
  allowDragLastColumn: true,
  preserveExpandedContent: false
});

const emit = defineEmits<{
  "row-click": [row: T, rowIndex: number, event: MouseEvent | KeyboardEvent];
  "row-dblclick": [row: T, rowIndex: number, event: MouseEvent];
  "row-contextmenu": [row: T, rowIndex: number, event: MouseEvent];
  "cell-click": [
    row: T,
    column: TableResolvedColumn<T>,
    cell: HTMLTableCellElement,
    event: MouseEvent
  ];
  "cell-dblclick": [
    row: T,
    column: TableResolvedColumn<T>,
    cell: HTMLTableCellElement,
    event: MouseEvent
  ];
  "cell-contextmenu": [
    row: T,
    column: TableResolvedColumn<T>,
    cell: HTMLTableCellElement,
    event: MouseEvent
  ];
  "cell-mouse-enter": [
    row: T,
    column: TableResolvedColumn<T>,
    cell: HTMLTableCellElement,
    event: MouseEvent
  ];
  "cell-mouse-leave": [
    row: T,
    column: TableResolvedColumn<T>,
    cell: HTMLTableCellElement,
    event: MouseEvent
  ];
  "header-click": [column: TableResolvedColumn<T>, event: MouseEvent];
  "header-contextmenu": [column: TableResolvedColumn<T>, event: MouseEvent];
  "header-dragend": [
    newWidth: number,
    oldWidth: number,
    column: TableResolvedColumn<T>,
    event: MouseEvent
  ];
  "selection-change": [selection: T[]];
  select: [selection: T[], row: T];
  "select-all": [selection: T[]];
  "current-change": [currentRow: T | null, oldCurrentRow: T | null];
  "sort-change": [
    payload: { column: TableResolvedColumn<T>; prop: string | undefined; order: TableSortOrder }
  ];
  "filter-change": [value: TableFilterValues];
  "expand-change": [row: T, expandedRows: T[] | boolean];
  scroll: [payload: { scrollLeft: number; scrollTop: number }];
  "update:currentRowKey": [value: string | number | null];
  "update:sortProp": [value: string | undefined];
  "update:sortOrder": [value: TableSortOrder];
  "update:filterValues": [value: TableFilterValues];
  "update:expandRowKeys": [value: Array<string | number>];
}>();

const componentInstance = getCurrentInstance();
const attrs = useAttrs();
const ns = useNamespace("table");
const { loading: globalLoading } = useConfig();
const rootRef = ref<HTMLElement | null>(null);
const lastScrollEventKey = ref("0:0");
const resizeProxyVisible = ref(false);
const resizeProxyLeft = ref(0);
const { columns, registerColumn, unregisterColumn } = useTableColumns<T>();
const hasLoadingTextProp = computed(() => {
  const vnodeProps = componentInstance?.vnode.props ?? {};

  return "loadingText" in vnodeProps || "loading-text" in vnodeProps;
});
const resolvedLoading = computed(() =>
  resolveLoadingVisualConfig(
    globalLoading.value,
    "Loading...",
    hasLoadingTextProp.value,
    props.loadingText
  )
);

provide(tableContextKey, {
  registerColumn: registerColumn as never,
  unregisterColumn: unregisterColumn as never
});

const layout = useTableLayout();
const store = useTableStore<T>({
  props,
  columns,
  fitWidth: computed(() => layout.bodyClientWidth.value),
  emit: emit as (event: string, ...args: any[]) => void
});
type TableScrollToArg = Parameters<TableLayoutState["scrollTo"]>[0];
type TableSectionExpose = {
  tableRef: HTMLTableElement | null;
};

const mainHeaderTableRef = ref<TableSectionExpose | null>(null);
const leftHeaderTableRef = ref<TableSectionExpose | null>(null);
const rightHeaderTableRef = ref<TableSectionExpose | null>(null);
const mainBodyTableRef = ref<TableSectionExpose | null>(null);
const leftBodyTableRef = ref<TableSectionExpose | null>(null);
const rightBodyTableRef = ref<TableSectionExpose | null>(null);
const mainFooterTableRef = ref<TableSectionExpose | null>(null);
const leftFooterTableRef = ref<TableSectionExpose | null>(null);
const rightFooterTableRef = ref<TableSectionExpose | null>(null);
let rowHeightSyncFrame: number | null = null;
let rowHeightResizeObserver: ResizeObserver | null = null;

function getSectionTable(sectionRef: typeof mainHeaderTableRef) {
  return sectionRef.value?.tableRef ?? null;
}

function clearTableRowHeights(table: HTMLTableElement | null) {
  if (!table) {
    return;
  }

  table.querySelectorAll<HTMLTableRowElement>("tr").forEach((row) => {
    row.style.height = "";
  });
}

function syncTableGroupRowHeights(tables: Array<HTMLTableElement | null>) {
  const rowsByTable = tables.map((table) =>
    table ? Array.from(table.querySelectorAll<HTMLTableRowElement>("tr")) : []
  );
  const rowCount = rowsByTable.reduce((max, rows) => Math.max(max, rows.length), 0);

  for (let index = 0; index < rowCount; index += 1) {
    const rows = rowsByTable.map((items) => items[index]).filter(Boolean) as HTMLTableRowElement[];

    if (rows.length < 2) {
      continue;
    }

    const maxHeight = rows.reduce(
      (height, row) => Math.max(height, Math.ceil(row.getBoundingClientRect().height)),
      0
    );

    if (maxHeight <= 0) {
      continue;
    }

    rows.forEach((row) => {
      row.style.height = `${maxHeight}px`;
    });
  }
}

function observeRowHeightTables() {
  [
    getSectionTable(mainHeaderTableRef),
    getSectionTable(leftHeaderTableRef),
    getSectionTable(rightHeaderTableRef),
    getSectionTable(mainBodyTableRef),
    getSectionTable(leftBodyTableRef),
    getSectionTable(rightBodyTableRef),
    getSectionTable(mainFooterTableRef),
    getSectionTable(leftFooterTableRef),
    getSectionTable(rightFooterTableRef)
  ].forEach((table) => {
    if (table) {
      rowHeightResizeObserver?.observe(table);
    }
  });
}

function syncFixedPanelRowHeights() {
  rowHeightResizeObserver?.disconnect();

  const headerTables = [
    getSectionTable(mainHeaderTableRef),
    getSectionTable(leftHeaderTableRef),
    getSectionTable(rightHeaderTableRef)
  ];
  const bodyTables = [
    getSectionTable(mainBodyTableRef),
    getSectionTable(leftBodyTableRef),
    getSectionTable(rightBodyTableRef)
  ];
  const footerTables = [
    getSectionTable(mainFooterTableRef),
    getSectionTable(leftFooterTableRef),
    getSectionTable(rightFooterTableRef)
  ];
  const allTables = [...headerTables, ...bodyTables, ...footerTables];

  allTables.forEach(clearTableRowHeights);

  if (!store.hasFixedColumns.value) {
    return;
  }

  syncTableGroupRowHeights(headerTables);
  syncTableGroupRowHeights(bodyTables);
  syncTableGroupRowHeights(footerTables);
  observeRowHeightTables();
}

function scheduleFixedPanelRowHeightSync() {
  if (typeof window === "undefined") {
    return;
  }

  if (rowHeightSyncFrame !== null) {
    window.cancelAnimationFrame(rowHeightSyncFrame);
  }

  rowHeightSyncFrame = window.requestAnimationFrame(() => {
    rowHeightSyncFrame = null;
    syncFixedPanelRowHeights();
  });
}

function refreshRowHeightObserver() {
  if (typeof ResizeObserver === "undefined") {
    return;
  }

  rowHeightResizeObserver?.disconnect();
  rowHeightResizeObserver = new ResizeObserver(() => {
    scheduleFixedPanelRowHeightSync();
  });
  observeRowHeightTables();
}

watch(
  () => [
    store.leafColumns.value.map((column) => `${column.uid}:${column.realWidth}`).join("|"),
    store.bodyRows.value.length,
    props.showSummary,
    props.data.length,
    props.showHeader
  ],
  async () => {
    await nextTick();
    layout.syncLayout();
    scheduleFixedPanelRowHeightSync();
    refreshRowHeightObserver();
  },
  {
    flush: "post"
  }
);

watch(
  () => [
    getSectionTable(mainHeaderTableRef),
    getSectionTable(leftHeaderTableRef),
    getSectionTable(rightHeaderTableRef),
    getSectionTable(mainBodyTableRef),
    getSectionTable(leftBodyTableRef),
    getSectionTable(rightBodyTableRef),
    getSectionTable(mainFooterTableRef),
    getSectionTable(leftFooterTableRef),
    getSectionTable(rightFooterTableRef)
  ],
  async () => {
    await nextTick();
    scheduleFixedPanelRowHeightSync();
    refreshRowHeightObserver();
  },
  {
    flush: "post"
  }
);

onMounted(async () => {
  await nextTick();
  scheduleFixedPanelRowHeightSync();
  refreshRowHeightObserver();
});

onBeforeUnmount(() => {
  rowHeightResizeObserver?.disconnect();
  rowHeightResizeObserver = null;

  if (typeof window !== "undefined" && rowHeightSyncFrame !== null) {
    window.cancelAnimationFrame(rowHeightSyncFrame);
    rowHeightSyncFrame = null;
  }
});

const mergedStripe = computed(() => props.stripe ?? props.striped ?? false);
const mergedBorder = computed(() => props.border ?? props.bordered ?? false);
const hasExpandedRows = computed(() =>
  store.leafColumns.value.some((column) => column.type === "expand")
);
const mainTableWidth = computed(() =>
  store.leafColumns.value.reduce((total, column) => total + column.realWidth, 0)
);
const leftFixedWidth = computed(() =>
  store.leftFixedLeafColumns.value.reduce((total, column) => total + column.realWidth, 0)
);
const rightFixedWidth = computed(() =>
  store.rightFixedLeafColumns.value.reduce((total, column) => total + column.realWidth, 0)
);
const fixedBodyInnerStyle = computed(() => ({
  transform: `translateY(-${layout.scrollTop.value}px)`
}));
const scrollingStateClass = computed(() => {
  if (!layout.hasHorizontalScroll.value) {
    return "is-scrolling-none";
  }

  if (layout.showLeftShadow.value && layout.showRightShadow.value) {
    return "is-scrolling-middle";
  }

  if (layout.showLeftShadow.value) {
    return "is-scrolling-left";
  }

  if (layout.showRightShadow.value) {
    return "is-scrolling-right";
  }

  return "is-scrolling-none";
});
const nativeAttrs = computed<Record<string, unknown>>(() => {
  const rest = { ...attrs };
  delete rest.class;
  delete rest.style;
  return rest;
});
const tableRootClasses = computed(() => [
  ns.base.value,
  `${ns.base.value}--${props.size}`,
  ns.is("striped", mergedStripe.value),
  ns.is("bordered", mergedBorder.value),
  ns.is("loading", props.loading),
  ns.is("clickable", props.clickable),
  ns.is("summary", props.showSummary),
  ns.is("layout-auto", props.tableLayout === "auto"),
  ns.is("scrollable-x", layout.hasHorizontalScroll.value),
  ns.is("scrollable-y", layout.hasVerticalScroll.value),
  ns.is("fixed-columns", store.hasFixedColumns.value),
  ns.is("scrollbar-stable", props.scrollbarAlwaysOn),
  ns.is("resizing", resizeProxyVisible.value),
  scrollingStateClass.value,
  props.className,
  attrs.class
]);
const rootStyle = computed(() => [
  props.style,
  attrs.style,
  {
    width: toCssSize(props.width)
  }
]);
const bodyWrapperStyle = computed(() => ({
  height: toCssSize(props.height),
  maxHeight: props.height ? undefined : toCssSize(props.maxHeight)
}));
const leftFixedStyle = computed(() => ({
  width: toCssSize(leftFixedWidth.value)
}));
const rightFixedStyle = computed(() => ({
  width: toCssSize(rightFixedWidth.value)
}));
const resizeProxyStyle = computed(() => ({
  left: `${resizeProxyLeft.value}px`
}));

function handleHeaderClick(column: TableResolvedColumn<T>, event: MouseEvent) {
  emit("header-click", column, event);
}

function handleHeaderContextmenu(column: TableResolvedColumn<T>, event: MouseEvent) {
  emit("header-contextmenu", column, event);
}

function handleHeaderDragstart(left: number) {
  resizeProxyLeft.value = left;
  resizeProxyVisible.value = true;
}

function handleHeaderDragmove(left: number) {
  resizeProxyLeft.value = left;
}

function handleHeaderDragend(
  newWidth: number,
  oldWidth: number,
  column: TableResolvedColumn<T>,
  event: MouseEvent
) {
  resizeProxyVisible.value = false;
  emit("header-dragend", newWidth, oldWidth, column, event);
}

function handleRowClick(row: T, rowIndex: number, event: MouseEvent | KeyboardEvent) {
  emit("row-click", row, rowIndex, event);
}

function handleRowDblclick(row: T, rowIndex: number, event: MouseEvent) {
  emit("row-dblclick", row, rowIndex, event);
}

function handleRowContextmenu(row: T, rowIndex: number, event: MouseEvent) {
  emit("row-contextmenu", row, rowIndex, event);
}

function handleCellClick(
  row: T,
  column: TableResolvedColumn<T>,
  cell: HTMLTableCellElement,
  event: MouseEvent
) {
  emit("cell-click", row, column, cell, event);
}

function handleCellDblclick(
  row: T,
  column: TableResolvedColumn<T>,
  cell: HTMLTableCellElement,
  event: MouseEvent
) {
  emit("cell-dblclick", row, column, cell, event);
}

function handleCellContextmenu(
  row: T,
  column: TableResolvedColumn<T>,
  cell: HTMLTableCellElement,
  event: MouseEvent
) {
  emit("cell-contextmenu", row, column, cell, event);
}

function handleCellMouseEnter(
  row: T,
  column: TableResolvedColumn<T>,
  cell: HTMLTableCellElement,
  event: MouseEvent
) {
  emit("cell-mouse-enter", row, column, cell, event);
}

function handleCellMouseLeave(
  row: T,
  column: TableResolvedColumn<T>,
  cell: HTMLTableCellElement,
  event: MouseEvent
) {
  emit("cell-mouse-leave", row, column, cell, event);
}

function emitScrollState() {
  const payload = {
    scrollLeft: layout.scrollLeft.value,
    scrollTop: layout.scrollTop.value
  };
  const nextKey = `${payload.scrollLeft}:${payload.scrollTop}`;

  if (nextKey === lastScrollEventKey.value) {
    return;
  }

  lastScrollEventKey.value = nextKey;
  emit("scroll", payload);
}

function handleBodyScroll() {
  layout.handleBodyScroll();
  emitScrollState();
}

function handleFixedWheel(event: WheelEvent) {
  layout.handleFixedWheel(event);
  emitScrollState();
}

function clearSelection() {
  store.clearSelection();
}

function getSelectionRows() {
  return store.getSelectionRows();
}

function toggleAllSelection() {
  store.toggleAllSelection();
}

function toggleRowSelection(row: T, selected?: boolean, ignoreSelectable = true) {
  store.toggleRowSelection(row, selected, ignoreSelectable);
}

function toggleRowExpansion(row: T, expanded?: boolean) {
  store.toggleRowExpansion(row, expanded);
}

function setCurrentRow(row?: T | null) {
  store.setCurrentRow(row);
}

function clearSort() {
  store.clearSort();
}

function clearFilter(columnKeys?: string | string[]) {
  store.clearFilter(columnKeys);
}

function sort(prop: string, order: TableSortOrder) {
  store.sort(prop, order);
}

function doLayout() {
  layout.syncLayout();
  scheduleFixedPanelRowHeightSync();
}

function scrollTo(arg1: TableScrollToArg, arg2?: number) {
  layout.scrollTo(arg1, arg2);
  emitScrollState();
}

function setScrollLeft(left: number) {
  layout.setScrollLeft(left);
  emitScrollState();
}

function setScrollTop(top: number) {
  layout.setScrollTop(top);
  emitScrollState();
}

function updateKeyChildren(key: string | number, children: T[]) {
  store.updateKeyChildren(key, children);
}

defineExpose<TableInstance<T>>({
  clearSelection,
  getSelectionRows,
  toggleAllSelection,
  toggleRowSelection,
  toggleRowExpansion,
  setCurrentRow,
  clearSort,
  clearFilter,
  sort,
  doLayout,
  scrollTo,
  setScrollLeft,
  setScrollTop,
  updateKeyChildren
});
</script>

<template>
  <div
    ref="rootRef"
    :class="tableRootClasses"
    :style="rootStyle"
    :aria-busy="props.loading"
    v-bind="nativeAttrs"
  >
    <div
      v-show="resizeProxyVisible"
      class="xy-table__column-resize-proxy"
      :style="resizeProxyStyle"
      aria-hidden="true"
    />

    <div class="xy-table__hidden-columns" aria-hidden="true">
      <slot />
    </div>

    <div v-if="props.showHeader" class="xy-table__header-wrapper">
      <div :ref="layout.headerWrapperRef" class="xy-table__header-main">
        <table-header
          ref="mainHeaderTableRef"
          :store="store"
          panel="main"
          :table-width="mainTableWidth"
          :show-header="props.showHeader"
          :header-row-class-name="props.headerRowClassName"
          :header-row-style="props.headerRowStyle"
          :header-cell-class-name="props.headerCellClassName"
          :header-cell-style="props.headerCellStyle"
          :append-filter-panel-to="props.appendFilterPanelTo"
          :allow-drag-last-column="props.allowDragLastColumn"
          @header-dragstart="handleHeaderDragstart"
          @header-dragmove="handleHeaderDragmove"
          @header-click="handleHeaderClick"
          @header-contextmenu="handleHeaderContextmenu"
          @header-dragend="handleHeaderDragend"
        />
      </div>

      <div
        v-if="store.hasLeftFixedColumns.value"
        class="xy-table__fixed-panel xy-table__fixed-panel--header is-left"
        :style="leftFixedStyle"
      >
        <table-header
          ref="leftHeaderTableRef"
          :store="store"
          :columns="store.leftFixedColumns.value"
          panel="left"
          :show-header="props.showHeader"
          :header-row-class-name="props.headerRowClassName"
          :header-row-style="props.headerRowStyle"
          :header-cell-class-name="props.headerCellClassName"
          :header-cell-style="props.headerCellStyle"
          :append-filter-panel-to="props.appendFilterPanelTo"
          :allow-drag-last-column="props.allowDragLastColumn"
          @header-dragstart="handleHeaderDragstart"
          @header-dragmove="handleHeaderDragmove"
          @header-click="handleHeaderClick"
          @header-contextmenu="handleHeaderContextmenu"
          @header-dragend="handleHeaderDragend"
        />
      </div>

      <div
        v-if="store.hasRightFixedColumns.value"
        class="xy-table__fixed-panel xy-table__fixed-panel--header is-right"
        :style="rightFixedStyle"
      >
        <table-header
          ref="rightHeaderTableRef"
          :store="store"
          :columns="store.rightFixedColumns.value"
          panel="right"
          :show-header="props.showHeader"
          :header-row-class-name="props.headerRowClassName"
          :header-row-style="props.headerRowStyle"
          :header-cell-class-name="props.headerCellClassName"
          :header-cell-style="props.headerCellStyle"
          :append-filter-panel-to="props.appendFilterPanelTo"
          :allow-drag-last-column="props.allowDragLastColumn"
          @header-dragstart="handleHeaderDragstart"
          @header-dragmove="handleHeaderDragmove"
          @header-click="handleHeaderClick"
          @header-contextmenu="handleHeaderContextmenu"
          @header-dragend="handleHeaderDragend"
        />
      </div>
    </div>

    <div
      :ref="layout.bodyWrapperRef"
      class="xy-table__body-wrapper"
      :style="bodyWrapperStyle"
      :tabindex="props.scrollbarTabindex"
      @scroll="handleBodyScroll"
    >
      <div
        v-if="props.loading"
        class="xy-table__loading"
        :style="resolvedLoading.background ? { background: resolvedLoading.background } : undefined"
      >
        <slot name="loading">
          <XyLoadingIndicator
            :text="resolvedLoading.text"
            :spinner="resolvedLoading.spinner"
            :svg="resolvedLoading.svg"
            :svg-view-box="resolvedLoading.svgViewBox"
            layout="inline"
            size="md"
            surface
          />
        </slot>
      </div>

      <table-body
        v-if="store.bodyRows.value.length > 0"
        ref="mainBodyTableRef"
        :store="store"
        panel="main"
        :table-width="mainTableWidth"
        :row-class-name="props.rowClassName"
        :row-style="props.rowStyle"
        :cell-class-name="props.cellClassName"
        :cell-style="props.cellStyle"
        :clickable="props.clickable"
        :striped="mergedStripe"
        :highlight-current-row="props.highlightCurrentRow"
        :indent="props.indent"
        :span-method="props.spanMethod"
        :tooltip-formatter="props.tooltipFormatter"
        :preserve-expanded-content="props.preserveExpandedContent"
        expanded-row-mode="content"
        :main-table-width="mainTableWidth"
        :left-fixed-width="leftFixedWidth"
        :right-fixed-width="rightFixedWidth"
        @row-click="handleRowClick"
        @row-dblclick="handleRowDblclick"
        @row-contextmenu="handleRowContextmenu"
        @cell-click="handleCellClick"
        @cell-dblclick="handleCellDblclick"
        @cell-contextmenu="handleCellContextmenu"
        @cell-mouse-enter="handleCellMouseEnter"
        @cell-mouse-leave="handleCellMouseLeave"
      />

      <div v-else-if="!props.loading" class="xy-table__empty">
        <slot name="empty">
          <xy-empty :description="props.emptyText" />
        </slot>
      </div>

      <div v-if="$slots.append" class="xy-table__append-wrapper">
        <slot name="append" />
      </div>

      <div
        v-if="store.bodyRows.value.length > 0 && store.hasLeftFixedColumns.value"
        class="xy-table__fixed-panel xy-table__fixed-panel--body is-left"
        :style="leftFixedStyle"
        @wheel.prevent="handleFixedWheel($event)"
      >
        <div class="xy-table__fixed-panel-inner" :style="fixedBodyInnerStyle">
          <table-body
            ref="leftBodyTableRef"
            :store="store"
            :columns="store.leftFixedColumns.value"
            panel="left"
            :row-class-name="props.rowClassName"
            :row-style="props.rowStyle"
            :cell-class-name="props.cellClassName"
            :cell-style="props.cellStyle"
            :clickable="props.clickable"
            :striped="mergedStripe"
            :highlight-current-row="props.highlightCurrentRow"
            :indent="props.indent"
            :span-method="props.spanMethod"
            :tooltip-formatter="props.tooltipFormatter"
            :preserve-expanded-content="props.preserveExpandedContent"
            :expanded-row-mode="hasExpandedRows ? 'placeholder' : 'none'"
            :main-table-width="mainTableWidth"
            :left-fixed-width="leftFixedWidth"
            :right-fixed-width="rightFixedWidth"
            @row-click="handleRowClick"
            @row-dblclick="handleRowDblclick"
            @row-contextmenu="handleRowContextmenu"
            @cell-click="handleCellClick"
            @cell-dblclick="handleCellDblclick"
            @cell-contextmenu="handleCellContextmenu"
            @cell-mouse-enter="handleCellMouseEnter"
            @cell-mouse-leave="handleCellMouseLeave"
          />
        </div>
      </div>

      <div
        v-if="store.bodyRows.value.length > 0 && store.hasRightFixedColumns.value"
        class="xy-table__fixed-panel xy-table__fixed-panel--body is-right"
        :style="rightFixedStyle"
        @wheel.prevent="handleFixedWheel($event)"
      >
        <div class="xy-table__fixed-panel-inner" :style="fixedBodyInnerStyle">
          <table-body
            ref="rightBodyTableRef"
            :store="store"
            :columns="store.rightFixedColumns.value"
            panel="right"
            :row-class-name="props.rowClassName"
            :row-style="props.rowStyle"
            :cell-class-name="props.cellClassName"
            :cell-style="props.cellStyle"
            :clickable="props.clickable"
            :striped="mergedStripe"
            :highlight-current-row="props.highlightCurrentRow"
            :indent="props.indent"
            :span-method="props.spanMethod"
            :tooltip-formatter="props.tooltipFormatter"
            :preserve-expanded-content="props.preserveExpandedContent"
            :expanded-row-mode="hasExpandedRows ? 'placeholder' : 'none'"
            :main-table-width="mainTableWidth"
            :left-fixed-width="leftFixedWidth"
            :right-fixed-width="rightFixedWidth"
            @row-click="handleRowClick"
            @row-dblclick="handleRowDblclick"
            @row-contextmenu="handleRowContextmenu"
            @cell-click="handleCellClick"
            @cell-dblclick="handleCellDblclick"
            @cell-contextmenu="handleCellContextmenu"
            @cell-mouse-enter="handleCellMouseEnter"
            @cell-mouse-leave="handleCellMouseLeave"
          />
        </div>
      </div>
    </div>

    <div
      v-if="props.showSummary && store.bodyRows.value.length > 0"
      class="xy-table__footer-wrapper"
    >
      <div :ref="layout.footerWrapperRef" class="xy-table__footer-main">
        <table-footer ref="mainFooterTableRef" :store="store" panel="main" :table-width="mainTableWidth" />
      </div>

      <div
        v-if="store.hasLeftFixedColumns.value"
        class="xy-table__fixed-panel xy-table__fixed-panel--footer is-left"
        :style="leftFixedStyle"
      >
        <table-footer
          ref="leftFooterTableRef"
          :store="store"
          :columns="store.leftFixedColumns.value"
          panel="left"
        />
      </div>

      <div
        v-if="store.hasRightFixedColumns.value"
        class="xy-table__fixed-panel xy-table__fixed-panel--footer is-right"
        :style="rightFixedStyle"
      >
        <table-footer
          ref="rightFooterTableRef"
          :store="store"
          :columns="store.rightFixedColumns.value"
          panel="right"
        />
      </div>
    </div>
  </div>
</template>
