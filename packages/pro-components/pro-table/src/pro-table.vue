<script setup lang="ts">
import {
  computed,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  shallowRef,
  useAttrs,
  useSlots,
  watch,
  type PropType
} from "vue";
import Sortable from "sortablejs";
import { useNamespace } from "@xiaoye/primitives";
import {
  XyAlert,
  XyButton,
  XyPagination,
  XyTable,
  XyTableColumn,
  XyTag,
  type PaginationProps,
  type TableFilterValues,
  type TableInstance,
  type TableResolvedColumn,
  type TableSortOrder
} from "@xiaoye/components";
import { resolveProFieldComponent, resolveProFieldProps, cloneProValue, updateProModelValue } from "../../field-schema";
import { renderDisplayValue } from "../../../components/shared/display-renderer";
import { XySearchForm } from "../../search-form";
import { XySavedViewTabs } from "../../saved-view-tabs";
import { XyTableFilterDrawer } from "../../table-filter-drawer";
import { createProRequestContext, normalizeProRequestResult } from "../../request-utils";
import type {
  ProTableBatchAction,
  ProTableColumn,
  ProTableContextmenuItem,
  ProTableContextmenuPayload,
  ProTableDensity,
  ProTableExportPayload,
  ProTableInstance,
  ProTableProps,
  ProTableRow,
  ProTableSavedViewItem,
  ProTableSortChangePayload,
  ProTableToolbarAction
} from "./pro-table";
import {
  applyColumnFixed,
  applyColumnVisibility,
  cloneProTableColumns,
  flattenProTableColumns,
  getProTableColumnKey,
  resolveVisibleProTableColumns
} from "./pro-table";

defineOptions({
  name: "XyProTable",
  inheritAttrs: false
});

type DraftRow = Record<string, unknown>;
type ContextmenuState = {
  open: boolean;
  x: number;
  y: number;
  items: ProTableContextmenuItem[];
  payload: ProTableContextmenuPayload | null;
};

const props = withDefaults(defineProps<ProTableProps<any>>(), {
  title: "",
  description: "",
  loading: false,
  draggableRow: false,
  draggableColumn: false,
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
  paginationProps: () => ({}),
  workbench: () => ({}),
  request: undefined,
  views: undefined,
  batchActions: () => [],
  tableSelect: undefined,
  editable: undefined,
  virtual: undefined,
  contextmenu: undefined,
  exportOptions: undefined,
  printOptions: undefined
});

const emit = defineEmits<{
  "toolbar-action": [action: ProTableToolbarAction];
  "workbench-action": [action: string];
  "update:currentPage": [value: number];
  "update:pageSize": [value: number];
  "page-change": [page: number, pageSize: number];
  "row-click": [row: ProTableRow, column: unknown, event: MouseEvent | KeyboardEvent];
  "row-dblclick": [row: ProTableRow, column: unknown, event: MouseEvent];
  "selection-change": [selection: ProTableRow[]];
  select: [selection: ProTableRow[], row: ProTableRow];
  "select-all": [selection: ProTableRow[]];
  "drag-row-change": [rows: ProTableRow[]];
  "drag-column-change": [columns: ProTableColumn<ProTableRow>[]];
  "current-change": [currentRow: ProTableRow | null, oldCurrentRow: ProTableRow | null];
  "sort-change": [payload: { column: unknown; prop: string | undefined; order: TableSortOrder }];
  "filter-change": [value: TableFilterValues];
  "expand-change": [row: ProTableRow, expandedRows: ProTableRow[] | boolean];
  "request-success": [payload: ProTableRow[]];
  "request-error": [error: unknown];
  "batch-action": [action: ProTableBatchAction, selection: ProTableRow[]];
  "view-select": [item: ProTableSavedViewItem];
  "view-remove": [item: ProTableSavedViewItem];
  "view-create": [];
  "filter-apply": [payload: Record<string, unknown>];
  "filter-reset": [payload: Record<string, unknown>];
  export: [payload: ProTableExportPayload<ProTableRow>];
  print: [rows: ProTableRow[]];
  "contextmenu-select": [item: ProTableContextmenuItem, payload: ProTableContextmenuPayload<ProTableRow>];
  "table-select-confirm": [selection: ProTableRow[]];
  "edit-start": [payload: { row: ProTableRow | null; columnKey?: string }];
  "edit-cancel": [payload: { row: ProTableRow | null }];
  "edit-submit": [payload: { rows: ProTableRow[] }];
}>();

function move<TItem>(items: TItem[], fromIndex: number, toIndex: number) {
  const nextItems = items.slice();
  const [target] = nextItems.splice(fromIndex, 1);

  if (target === undefined) {
    return items.slice();
  }

  nextItems.splice(toIndex, 0, target);
  return nextItems;
}

function readPathValue(source: Record<string, unknown>, path: string | undefined) {
  if (!path) {
    return undefined;
  }

  return path.split(".").reduce<unknown>((value, segment) => {
    if (value && typeof value === "object" && segment in (value as Record<string, unknown>)) {
      return (value as Record<string, unknown>)[segment];
    }

    return undefined;
  }, source);
}

function stringifyCellValue(value: unknown) {
  if (value == null) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

function escapeCsvValue(value: unknown) {
  const text = stringifyCellValue(value);

  if (!/[",\n]/.test(text)) {
    return text;
  }

  return `"${text.replace(/"/g, "\"\"")}"`;
}

function cloneColumn<TItem extends ProTableRow>(column: ProTableColumn<TItem>): ProTableColumn<TItem> {
  return {
    ...column,
    children: column.children ? column.children.map((item) => cloneColumn(item)) : undefined
  };
}

const attrs = useAttrs();
const slots = useSlots() as Record<string, ((payload?: unknown) => unknown) | undefined>;
const ns = useNamespace("pro-table");
const rootRef = ref<HTMLDivElement | null>(null);
const tableRef = ref<TableInstance<any> | null>(null);
const internalColumns = ref<ProTableColumn<any>[]>(cloneProTableColumns(props.columns));
const internalData = ref<ProTableRow[]>(props.data.slice());
const requestLoading = ref(false);
const requestError = ref<unknown>(null);
const requestTotal = ref<number | undefined>(props.total);
const currentPageState = ref(props.currentPage ?? props.defaultCurrentPage);
const pageSizeState = ref(props.pageSize ?? props.defaultPageSize);
const tableDensity = ref<ProTableDensity>(props.workbench.defaultDensity ?? props.tableProps.size ?? "md");
const filterDrawerOpen = ref(false);
const settingsOpen = ref(false);
const fullscreen = ref(false);
const activeViewKey = ref(props.views?.activeViewKey ?? props.views?.savedViews?.[0]?.key ?? "");
const selectedRows = ref<ProTableRow[]>([]);
const currentRow = ref<ProTableRow | null>(null);
const tableEditing = ref(false);
const editingRowKeys = ref(new Set<string | number>());
const editingCellKey = ref("");
const editDrafts = shallowRef(new Map<string | number, DraftRow>());
const contextmenu = reactive<ContextmenuState>({
  open: false,
  x: 0,
  y: 0,
  items: [],
  payload: null
});

let rowSortable: Sortable | null = null;
let columnSortable: Sortable | null = null;
let latestRequestId = 0;

const resolvedWorkbench = computed(() => ({
  refresh: Boolean(props.workbench.refresh || props.request),
  density: Boolean(props.workbench.density),
  columnSetting: Boolean(props.workbench.columnSetting),
  fullscreen: Boolean(props.workbench.fullscreen),
  treeToggle: Boolean(props.workbench.treeToggle),
  filter: Boolean(props.workbench.filter || props.views?.filterFields?.length),
  export: Boolean(props.workbench.export || props.exportOptions),
  print: Boolean(props.workbench.print || props.printOptions)
}));
const resolvedPaginationTotal = computed(() => props.total ?? requestTotal.value);
const nativeAttrs = computed<Record<string, unknown>>(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});
const rootClasses = computed(() => [
  ns.base.value,
  ns.is("fullscreen", fullscreen.value),
  attrs.class
]);
const rootStyle = computed(() => [attrs.style]);
const hasSearchSlot = computed(() => Boolean(slots.search));
const searchModel = computed(() => props.views?.searchModel ?? null);
const filterModel = computed(() => props.views?.filterModel ?? null);
const searchFields = computed(() => props.views?.searchFields ?? []);
const filterFields = computed(() => props.views?.filterFields ?? []);
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
    Boolean(slots["toolbar-right"]) ||
    resolvedWorkbench.value.refresh ||
    resolvedWorkbench.value.density ||
    resolvedWorkbench.value.columnSetting ||
    resolvedWorkbench.value.fullscreen ||
    resolvedWorkbench.value.treeToggle ||
    resolvedWorkbench.value.filter ||
    resolvedWorkbench.value.export ||
    resolvedWorkbench.value.print
);
const hasSearch = computed(() => hasSearchSlot.value || searchFields.value.length > 0);
const hasFooterMeta = computed(() => Boolean(slots["footer-meta"]));
const canMultipleSelect = computed(
  () =>
    props.tableSelect?.enabled && props.tableSelect.mode !== "single" ||
    props.batchActions.some((action) => action.visible !== false)
);
const canSingleSelect = computed(
  () => props.tableSelect?.enabled && props.tableSelect.mode === "single"
);
const leafColumns = computed(() => flattenProTableColumns(internalColumns.value));
const visibleColumns = computed(() => resolveVisibleProTableColumns(internalColumns.value));
const visibleLeafColumns = computed(() => flattenProTableColumns(visibleColumns.value));
const exportableColumns = computed(() =>
  visibleLeafColumns.value.filter((column) => column.exportable !== false && column.type === "default")
);
const printableColumns = computed(() =>
  visibleLeafColumns.value.filter((column) => column.printable !== false && column.type === "default")
);
const visibleColumnKeys = computed(() =>
  leafColumns.value
    .filter((column) => column.hidden !== true)
    .map((column) => getProTableColumnKey(column))
);
const columnSettingEntries = computed(() =>
  leafColumns.value.map((column) => ({
    key: getProTableColumnKey(column),
    label: column.label || column.prop || "未命名列",
    fixed: column.fixed
  }))
);
const hasSelectionColumn = computed(() =>
  flattenProTableColumns(visibleColumns.value).some((column) => column.type === "selection")
);
const displayColumns = computed(() => {
  if (!canMultipleSelect.value || hasSelectionColumn.value) {
    return visibleColumns.value;
  }

  return [
    {
      key: "__selection__",
      type: "selection",
      width: 56,
      fixed: "left"
    } as ProTableColumn<ProTableRow>,
    ...visibleColumns.value
  ];
});
const tableBindings = computed(() => {
  const virtualProps = props.virtual?.enabled
    ? {
        virtual: true,
        virtualItemSize: props.virtual.itemSize,
        virtualOverscan: props.virtual.overscan ?? 6,
        height: props.virtual.height ?? props.tableProps.height
      }
    : {};

  return {
    ...props.tableProps,
    ...virtualProps,
    data: internalData.value,
    loading: props.loading || requestLoading.value,
    size: tableDensity.value,
    highlightCurrentRow: canSingleSelect.value || props.tableProps.highlightCurrentRow,
    rowKey: props.tableProps.rowKey ?? "id"
  };
});
const paginationBindings = computed(() => {
  const merged: Partial<PaginationProps> = {
    ...props.paginationProps,
    currentPage: currentPageState.value,
    pageSize: pageSizeState.value,
    defaultCurrentPage: props.defaultCurrentPage,
    defaultPageSize: props.defaultPageSize,
    total: resolvedPaginationTotal.value,
    pageSizes: props.pageSizes,
    layout: props.pageLayout,
    hideOnSinglePage: props.hideOnSinglePage
  };

  return merged;
});
const showPagination = computed(
  () =>
    props.pagination &&
    (typeof paginationBindings.value.total === "number" ||
      typeof paginationBindings.value.pageCount === "number")
);
const canColumnDrag = computed(
  () =>
    props.draggableColumn &&
    visibleColumns.value.length > 1 &&
    visibleColumns.value.every((column) => (column.children?.length ?? 0) === 0)
);
const showBatchBar = computed(
  () =>
    props.batchActions.some((action) => action.visible !== false) &&
    selectedRows.value.length > 0
);
const normalBatchActions = computed(() =>
  props.batchActions.filter((action) => action.visible !== false && !action.danger)
);
const dangerBatchActions = computed(() =>
  props.batchActions.filter((action) => action.visible !== false && action.danger)
);
const showEditableFooter = computed(
  () => tableEditing.value || editingRowKeys.value.size > 0 || Boolean(editingCellKey.value)
);
const selectionSummary = computed(() =>
  canSingleSelect.value ? (currentRow.value ? [currentRow.value] : []) : selectedRows.value
);
const showContextmenu = computed(() => contextmenu.open && contextmenu.items.length > 0);

function getRowKeyGetter() {
  return tableBindings.value.rowKey;
}

function resolveRowKey(row: ProTableRow, rowIndex: number) {
  const rowKey = getRowKeyGetter();

  if (typeof rowKey === "function") {
    return rowKey(row, rowIndex);
  }

  if (typeof rowKey === "string" && rowKey.length > 0) {
    const value = readPathValue(row, rowKey);

    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
  }

  if (typeof row.id === "string" || typeof row.id === "number") {
    return row.id;
  }

  return rowIndex;
}

function getRowKeyFromData(row: ProTableRow) {
  const index = internalData.value.findIndex((item) => Object.is(item, row));
  return resolveRowKey(row, Math.max(0, index));
}

function getColumnSlotName(column: ProTableColumn<any>) {
  return column.slot ?? column.prop ?? column.key;
}

function getHeaderSlotName(column: ProTableColumn<any>) {
  const baseName = getColumnSlotName(column);
  return column.headerSlot ?? (baseName ? `${baseName}-header` : undefined);
}

function getColumnByKey(columnKey?: string | null) {
  if (!columnKey) {
    return undefined;
  }

  return leafColumns.value.find((column) => getProTableColumnKey(column) === columnKey);
}

function isColumnEditable(
  column: ProTableColumn<ProTableRow>,
  row: ProTableRow,
  rowIndex: number
) {
  if (!props.editable?.enabled) {
    return false;
  }

  if (props.editable.canEditRow && !props.editable.canEditRow(row, rowIndex)) {
    return false;
  }

  return typeof column.editable === "function"
    ? column.editable(row, rowIndex)
    : Boolean(column.editable);
}

function ensureDraft(row: ProTableRow) {
  const rowKey = getRowKeyFromData(row);

  if (!editDrafts.value.has(rowKey)) {
    const nextDrafts = new Map(editDrafts.value);
    nextDrafts.set(rowKey, cloneProValue(row));
    editDrafts.value = nextDrafts;
  }

  return editDrafts.value.get(rowKey) as DraftRow;
}

function getDraftValue(row: ProTableRow, column: ProTableColumn<ProTableRow>) {
  const rowKey = getRowKeyFromData(row);
  const draft = editDrafts.value.get(rowKey) ?? row;
  const prop = column.prop ?? column.key;

  return prop ? readPathValue(draft, prop) : undefined;
}

function updateDraft(row: ProTableRow, column: ProTableColumn<ProTableRow>, value: unknown) {
  const prop = column.prop ?? column.key;

  if (!prop) {
    return;
  }

  const rowKey = getRowKeyFromData(row);
  const draft = ensureDraft(row);
  updateProModelValue(draft, prop, value);
  const nextDrafts = new Map(editDrafts.value);
  nextDrafts.set(rowKey, draft);
  editDrafts.value = nextDrafts;
}

function isEditingRow(row: ProTableRow) {
  return tableEditing.value || editingRowKeys.value.has(getRowKeyFromData(row));
}

function isEditingCell(row: ProTableRow, column: ProTableColumn<ProTableRow>) {
  const rowKey = getRowKeyFromData(row);
  const columnKey = getProTableColumnKey(column);
  return editingCellKey.value === `${rowKey}:${columnKey}`;
}

function shouldShowEditor(
  row: ProTableRow,
  rowIndex: number,
  column: ProTableColumn<ProTableRow>
) {
  if (!isColumnEditable(column, row, rowIndex)) {
    return false;
  }

  const mode = props.editable?.mode ?? "cell";

  if (mode === "table") {
    return tableEditing.value;
  }

  if (mode === "row") {
    return isEditingRow(row);
  }

  return isEditingCell(row, column);
}

function resolveEditorField(column: ProTableColumn<ProTableRow>, row: ProTableRow) {
  return {
    prop: column.prop ?? column.key ?? "",
    label: column.label ?? column.prop ?? column.key ?? "",
    component:
      typeof column.editor === "string" || column.editor == null ? column.editor ?? "input" : "input",
    componentProps:
      typeof column.editorProps === "function" ? column.editorProps(row) : column.editorProps ?? {},
    options: typeof column.options === "function" ? column.options(row) : column.options,
    placeholder: undefined
  };
}

function resolveEditorVNode(
  row: ProTableRow,
  rowIndex: number,
  column: ProTableColumn<ProTableRow>
) {
  const editorSlotName = column.editorSlot;

  if (editorSlotName && slots[editorSlotName]) {
    return slots[editorSlotName]?.({
      row,
      rowIndex,
      column,
      value: getDraftValue(row, column),
      update: (value: unknown) => updateDraft(row, column, value)
    });
  }

  const field = resolveEditorField(column, row);
  const component =
    typeof column.editor === "string" || column.editor == null
      ? resolveProFieldComponent(field)
      : column.editor;

  return h(component as any, {
    ...resolveProFieldProps(field),
    modelValue: getDraftValue(row, column),
    "onUpdate:modelValue": (value: unknown) => updateDraft(row, column, value),
    size: tableDensity.value
  });
}

function startEdit(
  row?: ProTableRow | null,
  column?: ProTableColumn<ProTableRow> | TableResolvedColumn<ProTableRow> | string | null
) {
  if (!props.editable?.enabled) {
    return;
  }

  const mode = props.editable.mode ?? "cell";

  if (mode === "table") {
    tableEditing.value = true;
    internalData.value.forEach((item) => {
      ensureDraft(item);
    });
    emit("edit-start", {
      row: null
    });
    return;
  }

  if (!row) {
    return;
  }

  const rowKey = getRowKeyFromData(row);
  ensureDraft(row);

  if (mode === "row") {
    const nextKeys = new Set(editingRowKeys.value);
    nextKeys.add(rowKey);
    editingRowKeys.value = nextKeys;
    emit("edit-start", {
      row,
      columnKey:
        typeof column === "string"
          ? column
          : column && "prop" in column
            ? getProTableColumnKey(column as ProTableColumn<ProTableRow>)
            : undefined
    });
    return;
  }

  const columnKey =
    typeof column === "string"
      ? column
      : column && "prop" in column
        ? getProTableColumnKey(column as ProTableColumn<ProTableRow>)
        : "";

  editingCellKey.value = `${rowKey}:${columnKey}`;
  emit("edit-start", {
    row,
    columnKey
  });
}

function clearDraftForRow(rowKey: string | number) {
  if (!editDrafts.value.has(rowKey)) {
    return;
  }

  const nextDrafts = new Map(editDrafts.value);
  nextDrafts.delete(rowKey);
  editDrafts.value = nextDrafts;
}

function cancelEdit(row?: ProTableRow | null) {
  if (!row) {
    tableEditing.value = false;
    editingRowKeys.value = new Set();
    editingCellKey.value = "";
    editDrafts.value = new Map();
    emit("edit-cancel", {
      row: null
    });
    return;
  }

  const rowKey = getRowKeyFromData(row);
  const nextRowKeys = new Set(editingRowKeys.value);
  nextRowKeys.delete(rowKey);
  editingRowKeys.value = nextRowKeys;

  if (editingCellKey.value.startsWith(`${rowKey}:`)) {
    editingCellKey.value = "";
  }

  clearDraftForRow(rowKey);
  emit("edit-cancel", {
    row
  });
}

function applyDraftRow(rowKey: string | number) {
  const draft = editDrafts.value.get(rowKey);

  if (!draft) {
    return undefined;
  }

  const nextRows = internalData.value.map((row, index) =>
    resolveRowKey(row, index) === rowKey ? { ...row, ...draft } : row
  );

  internalData.value = nextRows;
  clearDraftForRow(rowKey);
  return nextRows.find((row, index) => resolveRowKey(row, index) === rowKey);
}

function submitEdit(row?: ProTableRow | null) {
  if (!row) {
    const updatedRows: ProTableRow[] = [];

    [...editDrafts.value.keys()].forEach((rowKey) => {
      const updated = applyDraftRow(rowKey);

      if (updated) {
        updatedRows.push(updated);
      }
    });

    tableEditing.value = false;
    editingRowKeys.value = new Set();
    editingCellKey.value = "";
    emit("edit-submit", {
      rows: updatedRows
    });
    return;
  }

  const rowKey = getRowKeyFromData(row);
  const updated = applyDraftRow(rowKey);
  const nextRowKeys = new Set(editingRowKeys.value);
  nextRowKeys.delete(rowKey);
  editingRowKeys.value = nextRowKeys;

  if (editingCellKey.value.startsWith(`${rowKey}:`)) {
    editingCellKey.value = "";
  }

  emit("edit-submit", {
    rows: updated ? [updated] : []
  });
}

function updateVisibleColumns(nextVisibleKeys: Array<string | number | boolean>) {
  internalColumns.value = applyColumnVisibility(
    internalColumns.value,
    new Set(nextVisibleKeys.map((item) => String(item)))
  );
  nextTick(() => {
    tableRef.value?.doLayout();
  });
}

function handleColumnVisibilityToggle(key: string, event: Event) {
  const target = event.target;
  const checked = target instanceof HTMLInputElement ? target.checked : false;
  const nextKeys = checked
    ? [...visibleColumnKeys.value, key]
    : visibleColumnKeys.value.filter((item) => item !== key);

  updateVisibleColumns(nextKeys);
}

function updateColumnFixedState(key: string, fixed?: "left" | "right") {
  internalColumns.value = applyColumnFixed(internalColumns.value, key, fixed);
  nextTick(() => {
    tableRef.value?.doLayout();
  });
}

function normalizeBatchActionType(action: ProTableBatchAction) {
  if (action.type) {
    return action.type;
  }

  return action.danger ? "danger" : "default";
}

function emitToolbarAction(action: ProTableToolbarAction) {
  emit("toolbar-action", action);
}

function setDensity(density: ProTableDensity) {
  tableDensity.value = density;
  emit("workbench-action", `density:${density}`);
  nextTick(() => {
    tableRef.value?.doLayout();
  });
}

async function toggleFullscreen(force?: boolean) {
  const host = rootRef.value;

  if (!host || typeof document === "undefined") {
    fullscreen.value = force ?? !fullscreen.value;
    return;
  }

  const shouldOpen = force ?? !fullscreen.value;

  try {
    if (shouldOpen) {
      if (document.fullscreenElement !== host) {
        await host.requestFullscreen?.();
      }
    } else if (document.fullscreenElement) {
      await document.exitFullscreen?.();
    }
  } catch {
    fullscreen.value = shouldOpen;
  }

  fullscreen.value = shouldOpen;
  emit("workbench-action", shouldOpen ? "fullscreen:open" : "fullscreen:close");
}

function openFilterDrawer() {
  if (!filterFields.value.length) {
    return;
  }

  filterDrawerOpen.value = true;
}

function closeFilterDrawer() {
  filterDrawerOpen.value = false;
}

function handleFilterApply(payload: Record<string, unknown>) {
  emit("filter-apply", payload);
  requestReload("filter");
}

function handleFilterReset(payload: Record<string, unknown>) {
  emit("filter-reset", payload);
  requestReload("reset");
}

function getVisibleColumns() {
  return cloneProTableColumns(visibleColumns.value);
}

function closeContextmenu() {
  contextmenu.open = false;
  contextmenu.items = [];
  contextmenu.payload = null;
}

function resolveContextmenuItems(payload: ProTableContextmenuPayload<ProTableRow>) {
  if (!props.contextmenu) {
    return [];
  }

  if (props.contextmenu.getItems) {
    return props.contextmenu.getItems(payload).filter((item) => item.visible !== false);
  }

  const items =
    payload.scope === "row"
      ? props.contextmenu.rowItems
      : payload.scope === "cell"
        ? props.contextmenu.cellItems
        : props.contextmenu.headerItems;

  return (items ?? []).filter((item) => item.visible !== false);
}

function openContextmenu(payload: ProTableContextmenuPayload<ProTableRow>) {
  const items = resolveContextmenuItems(payload);

  if (!items.length) {
    return;
  }

  contextmenu.open = true;
  contextmenu.x = payload.event.clientX;
  contextmenu.y = payload.event.clientY;
  contextmenu.items = items;
  contextmenu.payload = payload;
}

function handleContextmenuSelect(item: ProTableContextmenuItem) {
  if (!contextmenu.payload || item.disabled) {
    return;
  }

  item.handler?.(contextmenu.payload);
  emit("contextmenu-select", item, contextmenu.payload);
  closeContextmenu();
}

function buildRequestParams() {
  return {
    ...(props.request?.requestParams ?? {}),
    ...(searchModel.value ?? {}),
    ...(filterModel.value ?? {}),
    ...(activeViewKey.value ? { activeViewKey: activeViewKey.value } : {})
  };
}

async function requestReload(action = "reload") {
  if (!props.request) {
    return;
  }

  const requestId = ++latestRequestId;
  requestLoading.value = true;
  requestError.value = null;

  try {
    const params = buildRequestParams();
    const result = await props.request.request(
      params,
      createProRequestContext(action, params, currentPageState.value, pageSizeState.value)
    );
    const normalized = normalizeProRequestResult(result);

    if (requestId !== latestRequestId) {
      return;
    }

    internalData.value = normalized.data as ProTableRow[];
    requestTotal.value = normalized.total;
    emit("request-success", internalData.value.slice());
  } catch (error) {
    if (requestId !== latestRequestId) {
      return;
    }

    requestError.value = error;
    emit("request-error", error);
  } finally {
    if (requestId === latestRequestId) {
      requestLoading.value = false;
    }
  }
}

async function reload() {
  await requestReload("reload");
}

async function refresh() {
  await requestReload("refresh");
}

async function reset() {
  currentPageState.value = props.defaultCurrentPage;
  pageSizeState.value = props.defaultPageSize;
  cancelEdit();
  closeContextmenu();
  selectedRows.value = [];
  if (searchModel.value) {
    Object.keys(searchModel.value).forEach((key) => {
      searchModel.value![key] = undefined;
    });
  }
  if (filterModel.value) {
    Object.keys(filterModel.value).forEach((key) => {
      filterModel.value![key] = undefined;
    });
  }
  await requestReload("reset");
}

function handleRefresh() {
  emit("workbench-action", "refresh");
  void refresh();
}

function handleCurrentPageUpdate(value: number) {
  currentPageState.value = value;
  emit("update:currentPage", value);
}

function handlePageSizeUpdate(value: number) {
  pageSizeState.value = value;
  emit("update:pageSize", value);
}

function handlePageChange(page: number, pageSize: number) {
  currentPageState.value = page;
  pageSizeState.value = pageSize;
  emit("page-change", page, pageSize);
  if (props.request) {
    void requestReload("page-change");
  }
}

function handleSearch() {
  currentPageState.value = 1;
  void requestReload("search");
}

function handleSearchReset() {
  currentPageState.value = 1;
  void requestReload("reset");
}

function handleSavedViewSelect(item: ProTableSavedViewItem) {
  activeViewKey.value = item.key;
  emit("view-select", item);
  void requestReload("view-change");
}

function handleSelectionChange(selection: ProTableRow[]) {
  selectedRows.value = selection;
  emit("selection-change", selection);
}

function handleSelect(selection: ProTableRow[], row: ProTableRow) {
  selectedRows.value = selection;
  emit("select", selection, row);
}

function handleSelectAll(selection: ProTableRow[]) {
  selectedRows.value = selection;
  emit("select-all", selection);
}

function handleCurrentChange(nextCurrentRow: ProTableRow | null, oldCurrentRow: ProTableRow | null) {
  currentRow.value = nextCurrentRow;
  emit("current-change", nextCurrentRow, oldCurrentRow);
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

function handleRowContextmenu(
  row: ProTableRow,
  column: TableResolvedColumn<ProTableRow> | undefined,
  event: MouseEvent
) {
  openContextmenu({
    scope: "row",
    row,
    column,
    event
  });
}

function handleCellContextmenu(
  row: ProTableRow,
  column: TableResolvedColumn<ProTableRow>,
  cell: HTMLTableCellElement,
  event: MouseEvent
) {
  openContextmenu({
    scope: "cell",
    row,
    column,
    cell,
    event
  });
}

function handleHeaderContextmenu(column: TableResolvedColumn<ProTableRow>, event: MouseEvent) {
  openContextmenu({
    scope: "header",
    column,
    event
  });
}

function resolveSingleSelection(row: ProTableRow) {
  if (!canSingleSelect.value) {
    return;
  }

  currentRow.value = row;
  tableRef.value?.setCurrentRow(row);
}

function handleRowClick(row: ProTableRow, column: TableResolvedColumn<ProTableRow> | undefined, event: MouseEvent | KeyboardEvent) {
  if (
    props.editable?.enabled &&
    props.editable.trigger === "click" &&
    column &&
    getColumnByKey(column.columnKey ?? column.prop ?? column.label)
  ) {
    startEdit(row, column.columnKey ?? column.prop ?? column.label);
  }

  resolveSingleSelection(row);
  emit("row-click", row, column, event);
}

function handleRowDblClick(row: ProTableRow, column: TableResolvedColumn<ProTableRow> | undefined, event: MouseEvent) {
  if (props.editable?.enabled && props.editable.trigger !== "click" && column) {
    startEdit(row, column.columnKey ?? column.prop ?? column.label);
  }

  emit("row-dblclick", row, column, event);
}

function handleBatchAction(action: ProTableBatchAction) {
  emit("batch-action", action, selectedRows.value.slice());
}

function handleTableSelectConfirm() {
  emit("table-select-confirm", selectionSummary.value.slice());
}

async function handleExport(type?: "csv" | "excel") {
  const exportType = type ?? props.exportOptions?.defaultType ?? "csv";
  const filename = props.exportOptions?.filename ?? "pro-table-export";
  const rows = internalData.value.slice();
  const columns = exportableColumns.value.map((column) => cloneColumn(column));
  const payload = {
    type: exportType,
    filename,
    columns,
    rows
  };

  if ((await props.exportOptions?.beforeExport?.(payload)) === false) {
    return;
  }

  const mappedRows = rows.map((row) => props.exportOptions?.mapRow?.(row) ?? row);
  const headers = columns.map((column) => column.label ?? column.prop ?? column.key ?? "");
  const records = mappedRows.map((row) =>
    columns.map((column) => {
      const key = column.prop ?? column.key;
      return stringifyCellValue(key ? readPathValue(row, key) : undefined);
    })
  );

  if (exportType === "excel") {
    const XLSX = await import("xlsx");
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...records]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } else {
    const csv = [headers.map((value) => escapeCsvValue(value)).join(","), ...records.map((row) => row.map((value) => escapeCsvValue(value)).join(","))].join("\n");
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${filename}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  emit("export", payload);
}

async function handlePrint() {
  const rows = internalData.value.slice();

  if ((await props.printOptions?.beforePrint?.(rows)) === false) {
    return;
  }

  const printWindow = window.open("", "_blank", "noopener,noreferrer");

  if (!printWindow) {
    return;
  }

  const title = props.printOptions?.title ?? props.title ?? "表格打印";
  const subtitle = props.printOptions?.subtitle ?? props.description ?? "";
  const headers = printableColumns.value.map((column) => column.label ?? column.prop ?? column.key ?? "");
  const body = rows
    .map(
      (row) =>
        `<tr>${printableColumns.value
          .map((column) => `<td>${escapeCsvValue(readPathValue(row, column.prop ?? column.key)).replace(/"/g, "")}</td>`)
          .join("")}</tr>`
    )
    .join("");

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: sans-serif; padding: 24px; color: #111827; }
          h1 { font-size: 20px; margin: 0 0 8px; }
          p { margin: 0 0 16px; color: #6b7280; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #d1d5db; padding: 10px 12px; text-align: left; }
          th { background: #f3f4f6; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${subtitle ? `<p>${subtitle}</p>` : ""}
        <table>
          <thead>
            <tr>${headers.map((item) => `<th>${item}</th>`).join("")}</tr>
          </thead>
          <tbody>${body}</tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
  emit("print", rows);
}

function reorderVisibleTopLevelColumns(fromIndex: number, toIndex: number) {
  const source = internalColumns.value.slice();
  const visibleIndexes = source
    .map((column, index) => ({ column, index }))
    .filter(({ column }) => !column.hidden);

  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= visibleIndexes.length ||
    toIndex >= visibleIndexes.length
  ) {
    return source;
  }

  const reorderedVisibleColumns = move(
    visibleIndexes.map(({ column }) => column),
    fromIndex,
    toIndex
  );
  const nextColumns = source.slice();

  visibleIndexes.forEach(({ index }, orderIndex) => {
    nextColumns[index] = reorderedVisibleColumns[orderIndex];
  });

  return nextColumns;
}

function destroySortables() {
  rowSortable?.destroy();
  rowSortable = null;
  columnSortable?.destroy();
  columnSortable = null;
}

async function syncSortables() {
  destroySortables();
  await nextTick();

  if (props.draggableRow) {
    const body = rootRef.value?.querySelector(".xy-table__body-wrapper tbody");

    if (body) {
      rowSortable = Sortable.create(body as HTMLElement, {
        animation: 150,
        onEnd: ({ oldIndex, newIndex }) => {
          if (oldIndex == null || newIndex == null || oldIndex === newIndex) {
            return;
          }

          internalData.value = move(internalData.value, oldIndex, newIndex);
          emit("drag-row-change", internalData.value.slice());
        }
      });
    }
  }

  if (canColumnDrag.value) {
    const headerRow = rootRef.value?.querySelector(".xy-table__header-main thead tr:last-child");

    if (headerRow) {
      columnSortable = Sortable.create(headerRow as HTMLElement, {
        animation: 150,
        onEnd: ({ oldIndex, newIndex }) => {
          if (oldIndex == null || newIndex == null || oldIndex === newIndex) {
            return;
          }

          internalColumns.value = reorderVisibleTopLevelColumns(oldIndex, newIndex);
          emit("drag-column-change", internalColumns.value.slice());
          nextTick(() => {
            tableRef.value?.doLayout();
          });
        }
      });
    }
  }
}

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
      const slotName = getColumnSlotName(column);
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
      } else {
        slotConfig.default = (payload: any) => {
          const row = payload.row as ProTableRow;
          const rowIndex = payload.rowIndex as number;

          if (shouldShowEditor(row, rowIndex, column)) {
            return resolveEditorVNode(row, rowIndex, column);
          }

          if (slotName && slots[slotName]) {
            return slots[slotName]?.(payload);
          }

          return renderDisplayValue({
            value: payload.value,
            row,
            rowIndex,
            column
          });
        };
      }

      if (headerSlotName && slots[headerSlotName]) {
        slotConfig.header = (payload) => slots[headerSlotName]?.(payload);
      }

      return h(
        XyTableColumn,
        {
          ...column,
          children: undefined,
          slot: undefined,
          headerSlot: undefined,
          editor: undefined,
          editorProps: undefined,
          editorSlot: undefined,
          options: undefined,
          hidden: undefined,
          editable: undefined,
          exportable: undefined,
          printable: undefined
        },
        slotConfig
      );
    };
  }
});

watch(
  () => props.columns,
  (value) => {
    internalColumns.value = cloneProTableColumns(value);
  },
  {
    deep: true
  }
);

watch(
  () => props.data,
  (value) => {
    if (!props.request) {
      internalData.value = value.slice();
    }
  },
  {
    deep: true
  }
);

watch(
  () => props.total,
  (value) => {
    if (value !== undefined) {
      requestTotal.value = value;
    }
  }
);

watch(
  () => props.currentPage,
  (value) => {
    if (value !== undefined) {
      currentPageState.value = value;
    }
  }
);

watch(
  () => props.pageSize,
  (value) => {
    if (value !== undefined) {
      pageSizeState.value = value;
    }
  }
);

watch(
  () => [props.draggableRow, props.draggableColumn, internalData.value.length, visibleColumns.value.length],
  () => {
    void syncSortables();
  },
  {
    flush: "post"
  }
);

watch(
  () => props.request?.requestParams,
  () => {
    if (props.request?.autoReloadOnParamsChange !== false) {
      void requestReload("params-change");
    }
  },
  {
    deep: true
  }
);

watch(
  () => props.views?.activeViewKey,
  (value) => {
    if (value !== undefined) {
      activeViewKey.value = value;
    }
  }
);

function handleDocumentClick(event: MouseEvent) {
  const target = event.target;

  if (!(target instanceof Node)) {
    closeContextmenu();
    return;
  }

  if (rootRef.value?.contains(target)) {
    return;
  }

  closeContextmenu();
}

function syncFullscreenState() {
  if (typeof document === "undefined" || !rootRef.value) {
    return;
  }

  fullscreen.value = document.fullscreenElement === rootRef.value;
}

onMounted(() => {
  void syncSortables();
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("fullscreenchange", syncFullscreenState);

  if (props.request?.immediate !== false) {
    void requestReload("initial");
  }
});

onBeforeUnmount(() => {
  destroySortables();
  document.removeEventListener("click", handleDocumentClick);
  document.removeEventListener("fullscreenchange", syncFullscreenState);
});

defineExpose<ProTableInstance<ProTableRow>>({
  get columns() {
    return tableRef.value?.columns ?? [];
  },
  get bodyRows() {
    return tableRef.value?.bodyRows ?? [];
  },
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
  setScrollLeft: (left: number) => tableRef.value?.setScrollLeft(left),
  setAllTreeRowsExpanded: (expanded?: boolean) => tableRef.value?.setAllTreeRowsExpanded(expanded),
  updateKeyChildren: (key: string | number, children: ProTableRow[]) =>
    tableRef.value?.updateKeyChildren(key, children),
  reload,
  refresh,
  reset,
  toggleFullscreen,
  setDensity,
  openFilterDrawer,
  closeFilterDrawer,
  getVisibleColumns,
  startEdit,
  cancelEdit,
  submitEdit
});
</script>

<template>
  <div ref="rootRef" :class="rootClasses" :style="rootStyle" v-bind="nativeAttrs">
    <div v-if="hasToolbar" class="xy-pro-table__toolbar">
      <div class="xy-pro-table__toolbar-main">
        <slot name="toolbar-main">
          <h3 v-if="props.title" class="xy-pro-table__title">{{ props.title }}</h3>
          <p v-if="props.description" class="xy-pro-table__description">
            {{ props.description }}
          </p>
        </slot>
      </div>
      <div class="xy-pro-table__toolbar-extra">
        <slot name="toolbar-left" />

        <div v-if="resolvedWorkbench.density" class="xy-pro-table__density">
          <xy-button
            v-for="density in ['sm', 'md', 'lg']"
            :key="density"
            :type="tableDensity === density ? 'primary' : 'default'"
            text
            @click="setDensity(density as ProTableDensity)"
          >
            {{ density.toUpperCase() }}
          </xy-button>
        </div>

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

        <xy-button v-if="resolvedWorkbench.refresh" text @click="handleRefresh">刷新</xy-button>
        <xy-button v-if="resolvedWorkbench.filter" text @click="openFilterDrawer">筛选</xy-button>
        <xy-button
          v-if="resolvedWorkbench.treeToggle && tableRef?.bodyRows?.length"
          text
          @click="tableRef?.setAllTreeRowsExpanded(true)"
        >
          展开树
        </xy-button>
        <xy-button
          v-if="resolvedWorkbench.treeToggle && tableRef?.bodyRows?.length"
          text
          @click="tableRef?.setAllTreeRowsExpanded(false)"
        >
          收起树
        </xy-button>
        <xy-button v-if="resolvedWorkbench.columnSetting" text @click="settingsOpen = !settingsOpen">
          列设置
        </xy-button>
        <xy-button v-if="resolvedWorkbench.export" text @click="handleExport()">导出</xy-button>
        <xy-button v-if="resolvedWorkbench.print" text @click="handlePrint">打印</xy-button>
        <xy-button v-if="resolvedWorkbench.fullscreen" text @click="toggleFullscreen()">
          {{ fullscreen ? "退出全屏" : "全屏" }}
        </xy-button>

        <slot name="toolbar-right" />
      </div>
    </div>

    <div v-if="settingsOpen && resolvedWorkbench.columnSetting" class="xy-pro-table__settings-panel">
      <div class="xy-pro-table__settings-header">
        <strong>列设置</strong>
        <xy-button text @click="updateVisibleColumns(columnSettingEntries.map((item) => item.key))">
          全选
        </xy-button>
      </div>
      <div class="xy-pro-table__settings-list">
        <div v-for="entry in columnSettingEntries" :key="entry.key" class="xy-pro-table__settings-item">
          <label class="xy-pro-table__settings-checkbox">
            <input
              type="checkbox"
              :checked="visibleColumnKeys.includes(entry.key)"
              @change="handleColumnVisibilityToggle(entry.key, $event)"
            />
            <span>{{ entry.label }}</span>
          </label>
          <div class="xy-pro-table__settings-fixed">
            <xy-button
              text
              :type="entry.fixed === 'left' ? 'primary' : 'default'"
              @click="updateColumnFixedState(entry.key, entry.fixed === 'left' ? undefined : 'left')"
            >
              左
            </xy-button>
            <xy-button
              text
              :type="entry.fixed === 'right' ? 'primary' : 'default'"
              @click="updateColumnFixedState(entry.key, entry.fixed === 'right' ? undefined : 'right')"
            >
              右
            </xy-button>
          </div>
        </div>
      </div>
      <p v-if="props.draggableColumn" class="xy-pro-table__settings-tip">已开启列拖拽，可直接拖表头调整顺序。</p>
    </div>

    <xy-saved-view-tabs
      v-if="props.views?.savedViews?.length"
      v-model:active-key="activeViewKey"
      :items="props.views.savedViews"
      addable
      @select="handleSavedViewSelect"
      @remove="emit('view-remove', $event)"
      @create="emit('view-create')"
    />

    <div v-if="hasSearch" class="xy-pro-table__search">
      <slot name="search">
        <xy-search-form
          v-if="searchModel && searchFields.length > 0"
          :model="searchModel"
          :fields="searchFields"
          @search="handleSearch"
          @reset="handleSearchReset"
        />
      </slot>
    </div>

    <div v-if="showBatchBar" class="xy-pro-table__batch-bar">
      <xy-alert class="xy-pro-table__batch-alert" type="info" effect="light" :closable="false" show-icon>
        <template #title>
          <div class="xy-pro-table__batch-title">
            <span>已选</span>
            <xy-tag status="primary" size="sm">{{ selectedRows.length }} 项</xy-tag>
          </div>
        </template>
        <template #actions>
          <div class="xy-pro-table__batch-actions">
            <xy-button
              v-for="action in normalBatchActions"
              :key="action.key"
              :type="normalizeBatchActionType(action)"
              :disabled="action.disabled"
              :loading="action.loading"
              :icon="action.icon"
              @click="handleBatchAction(action)"
            >
              {{ action.label }}
            </xy-button>
            <xy-button
              v-for="action in dangerBatchActions"
              :key="action.key"
              :type="normalizeBatchActionType(action)"
              :disabled="action.disabled"
              :loading="action.loading"
              :icon="action.icon"
              @click="handleBatchAction(action)"
            >
              {{ action.label }}
            </xy-button>
            <xy-button text @click="tableRef?.clearSelection()">清空选择</xy-button>
          </div>
        </template>
      </xy-alert>
    </div>

    <xy-alert
      v-if="requestError"
      class="xy-pro-table__error"
      type="error"
      :title="requestError instanceof Error ? requestError.message : '请求失败'"
      :closable="false"
      show-icon
    />

    <div class="xy-pro-table__table">
      <xy-table
        ref="tableRef"
        v-bind="tableBindings"
        @row-click="handleRowClick"
        @row-dblclick="handleRowDblClick"
        @row-contextmenu="handleRowContextmenu"
        @cell-contextmenu="handleCellContextmenu"
        @header-contextmenu="handleHeaderContextmenu"
        @selection-change="handleSelectionChange"
        @select="handleSelect"
        @select-all="handleSelectAll"
        @current-change="handleCurrentChange"
        @sort-change="handleSortChange"
        @filter-change="handleFilterChange"
        @expand-change="handleExpandChange"
      >
        <template v-if="slots.loading" #loading>
          <slot name="loading" :loading="props.loading || requestLoading" />
        </template>
        <template v-if="slots.empty" #empty>
          <slot name="empty" :empty="!props.loading && !requestLoading && internalData.length === 0" />
        </template>
        <ProTableColumnRenderer
          v-for="visibleColumn in displayColumns"
          :key="visibleColumn.key ?? visibleColumn.prop ?? visibleColumn.label"
          :column="visibleColumn"
        />
      </xy-table>
    </div>

    <div v-if="props.tableSelect?.enabled" class="xy-pro-table__selection-bar">
      <div class="xy-pro-table__selection-summary">
        <strong>{{ props.tableSelect.title ?? "表格选择器" }}</strong>
        <span>{{ props.tableSelect.description ?? "统一查询、表格与确认选择链路。" }}</span>
      </div>
      <div class="xy-pro-table__selection-actions">
        <xy-tag status="primary">{{ selectionSummary.length }} 项</xy-tag>
        <xy-button text @click="tableRef?.clearSelection()">
          {{ props.tableSelect.clearText ?? "清空选择" }}
        </xy-button>
        <xy-button type="primary" @click="handleTableSelectConfirm">
          {{ props.tableSelect.confirmText ?? "确认选择" }}
        </xy-button>
      </div>
    </div>

    <div v-if="showEditableFooter" class="xy-pro-table__edit-footer">
      <span>当前存在未提交的编辑内容</span>
      <div class="xy-pro-table__edit-actions">
        <xy-button text @click="cancelEdit()">取消编辑</xy-button>
        <xy-button type="primary" @click="submitEdit()">保存编辑</xy-button>
      </div>
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

    <teleport to="body">
      <div
        v-if="showContextmenu"
        class="xy-pro-table__contextmenu"
        :style="{ left: `${contextmenu.x}px`, top: `${contextmenu.y}px` }"
      >
        <button
          v-for="item in contextmenu.items"
          :key="item.key"
          class="xy-pro-table__contextmenu-item"
          :class="{ 'is-danger': item.danger }"
          :disabled="item.disabled"
          type="button"
          @click="handleContextmenuSelect(item)"
        >
          {{ item.label }}
        </button>
      </div>
    </teleport>

    <xy-table-filter-drawer
      v-if="filterFields.length > 0 && filterModel"
      v-model:open="filterDrawerOpen"
      :title="props.views?.filterTitle ?? '筛选条件'"
      :model="filterModel"
      :fields="filterFields"
      @apply="handleFilterApply"
      @reset="handleFilterReset"
    />
  </div>
</template>
