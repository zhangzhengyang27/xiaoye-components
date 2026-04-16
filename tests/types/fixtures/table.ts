import { h, ref } from "vue";
import {
  XyTable,
  XyTableColumn,
  type TableColumnProps,
  type TableFilterValues,
  type TableInstance,
  type TableOverflowTooltipOptions,
  type TableProps,
  type TableSortOrder
} from "xiaoye-components";

interface Row {
  id: number;
  name: string;
  owner: string;
  score: number;
  status: "启用" | "停用";
  meta?: {
    identity?: {
      id?: number;
    };
  };
  hasChildren?: boolean;
  children?: Row[];
}

const tableRef = ref<TableInstance<Row> | null>(null);

tableRef.value?.columns.map((column) => column.uid);
tableRef.value?.clearSelection();
tableRef.value?.toggleAllSelection();
tableRef.value?.toggleRowSelection({ id: 1, name: "控制台", owner: "小叶", score: 96, status: "启用" }, true);
tableRef.value?.toggleRowSelection(
  { id: 1, name: "控制台", owner: "小叶", score: 96, status: "启用" },
  true,
  false
);
tableRef.value?.toggleRowExpansion({ id: 1, name: "控制台", owner: "小叶", score: 96, status: "启用" }, true);
tableRef.value?.setCurrentRow({ id: 1, name: "控制台", owner: "小叶", score: 96, status: "启用" });
tableRef.value?.clearSort();
tableRef.value?.clearFilter(["status"]);
tableRef.value?.sort("score", "descending");
tableRef.value?.doLayout();
tableRef.value?.scrollTo({
  top: 120,
  left: 16
});
tableRef.value?.setScrollLeft(24);
tableRef.value?.setScrollTop(320);
tableRef.value?.updateKeyChildren(1, [
  { id: 11, name: "账单", owner: "小叶", score: 88, status: "启用" }
]);

const tooltipOptions: TableOverflowTooltipOptions = {
  effect: "light",
  placement: "right",
  popperClass: "table-tooltip",
  popperOptions: {
    strategy: "fixed"
  }
};

const tableProps: TableProps<Row> = {
  data: [
    {
      id: 1,
      name: "控制台",
      owner: "小叶",
      score: 96,
      status: "启用",
      children: [{ id: 11, name: "账单", owner: "小叶", score: 88, status: "启用" }]
    }
  ],
  rowKey: "id",
  size: "md",
  width: 960,
  height: 320,
  fit: true,
  stripe: true,
  border: true,
  showHeader: true,
  showSummary: true,
  sumText: "总览",
  summaryMethod: ({ columns, data }) => columns.map((column, index) => (index === 0 ? "总览" : data.length)),
  rowClassName: ({ row }) => row.owner,
  rowStyle: ({ row }) => ({
    color: row.status === "启用" ? "var(--xy-color-success)" : "var(--xy-text-color)"
  }),
  cellClassName: ({ column }) => column.key,
  cellStyle: ({ column }) => ({
    textAlign: column.align
  }),
  headerRowClassName: ({ rowIndex }) => `header-row-${rowIndex}`,
  headerRowStyle: ({ row }) => ({
    minWidth: `${row.length * 10}px`,
    background: "var(--xy-bg-color-muted)"
  }),
  headerCellClassName: ({ column }) => column.uid,
  headerCellStyle: ({ column }) => ({
    textAlign: column.headerAlign
  }),
  defaultSort: {
    prop: "score",
    order: "descending"
  },
  currentRowKey: 1,
  expandRowKeys: [1],
  defaultExpandAll: false,
  rowExpandable: (row) => row.status === "启用",
  spanMethod: ({ rowIndex }) => (rowIndex === 0 ? [1, 1] : { rowspan: 1, colspan: 1 }),
  selectOnIndeterminate: true,
  indent: 20,
  treeProps: {
    children: "children",
    hasChildren: "hasChildren",
    checkStrictly: true
  },
  lazy: true,
  load: (_row, _treeNode, resolve) => resolve([]),
  tableLayout: "auto",
  scrollbarAlwaysOn: true,
  scrollbarTabindex: 0,
  flexible: true,
  nativeScrollbar: true,
  showOverflowTooltip: {
    placement: "bottom",
    showArrow: false
  },
  tooltipEffect: "light",
  tooltipOptions,
  tooltipFormatter: ({ cellValue }) => String(cellValue ?? ""),
  appendFilterPanelTo: "#table-filter-root",
  allowDragLastColumn: false,
  preserveExpandedContent: true,
  ariaLabel: "资产列表",
  ariaLabelledby: "table-title",
  ariaDescribedby: "table-help",
  className: "table-root",
  style: {
    minWidth: "720px"
  }
};

const compatProps: TableProps<Row> = {
  data: [{ id: 1, name: "控制台", owner: "小叶", score: 96, status: "启用" }],
  striped: true,
  bordered: true,
  sortProp: "score",
  sortOrder: "ascending",
  filterValues: {
    status: ["启用"]
  },
  defaultFilterValues: {
    status: ["启用"]
  }
};

const nestedRowKeyProps: TableProps<Row> = {
  data: [
    {
      id: 1,
      name: "控制台",
      owner: "小叶",
      score: 96,
      status: "启用",
      meta: {
        identity: {
          id: 101
        }
      }
    }
  ],
  rowKey: "meta.identity.id"
};

void tableProps;
void compatProps;
void nestedRowKeyProps;

const selectionColumn: TableColumnProps<Row> = {
  type: "selection",
  width: 52,
  selectable: (row) => row.status === "启用",
  reserveSelection: true,
  fixed: "left"
};

const indexColumn: TableColumnProps<Row> = {
  type: "index",
  label: "#",
  width: 64,
  index: (index) => index + 1,
  fixed: "left"
};

const expandColumn: TableColumnProps<Row> = {
  type: "expand",
  width: 56,
  fixed: "left"
};

const nameColumn: TableColumnProps<Row> = {
  prop: "name",
  label: "名称",
  renderHeader: ({ column }) => h("strong", `表头-${column.label}`),
  sortable: true,
  showOverflowTooltip: true,
  tooltipFormatter: ({ cellValue }) => `名称-${String(cellValue ?? "")}`,
  resizable: true
};

const legacyPropertyColumn: TableColumnProps<Row> = {
  property: "owner",
  label: "负责人别名列"
};

const statusColumn: TableColumnProps<Row> = {
  prop: "status",
  label: "状态",
  columnKey: "status",
  filters: [
    { text: "启用", value: "启用" },
    { text: "停用", value: "停用" }
  ],
  filterPlacement: "top-start",
  filterClassName: "status-filter",
  filteredValue: ["启用"],
  filterMethod: (value, row) => row.status === value
};

void selectionColumn;
void indexColumn;
void expandColumn;
void nameColumn;
void legacyPropertyColumn;
void statusColumn;

const sortOrder: TableSortOrder = "ascending";
const filterValues: TableFilterValues = {
  status: ["启用"]
};

void sortOrder;
void filterValues;
void tooltipOptions;

const vnode = h(
  XyTable,
  {
    data: [{ id: 1, name: "控制台", owner: "小叶", score: 96, status: "启用" }],
    rowKey: "id",
    stripe: true,
    border: true
  },
  {
    default: () => [
      h(XyTableColumn as never, { type: "selection", width: 52 } as never),
      h(XyTableColumn as never, { type: "index", width: 64, label: "#" } as never),
      h(
        XyTableColumn as never,
        { label: "基础信息" } as never,
        {
          default: () => [
            h(XyTableColumn as never, { prop: "name", label: "名称" } as never),
            h(XyTableColumn as never, { prop: "owner", label: "负责人" } as never)
          ]
        }
      ),
      h(
        XyTableColumn as never,
        {
          prop: "status",
          label: "状态",
          filters: [
            { text: "启用", value: "启用" },
            { text: "停用", value: "停用" }
          ]
        } as never,
        {
          default: ({ value }: { value: Row["status"] }) => value,
          "filter-icon": ({ filterOpened }: { filterOpened: boolean }) =>
            filterOpened ? "open" : "closed"
        }
      )
    ]
  }
);

const expandVNode = h(
  XyTable,
  {
    data: [{ id: 1, name: "控制台", owner: "小叶", score: 96, status: "启用" }],
    rowKey: "id"
  },
  {
    default: () => [
      h(
        XyTableColumn as never,
        { type: "expand" } as never,
        {
          expand: ({ row, expanded, expandable }: { row: Row; expanded: boolean; expandable: boolean }) =>
            `${row.name}-${expanded}-${expandable}`
        }
      )
    ]
  }
);

void expandVNode;

void vnode;

const invalidTableProps: TableProps<Row> = {
  data: [{ id: 1, name: "控制台", owner: "小叶", score: 96, status: "启用" }],
  // @ts-expect-error rowKey should follow generic row type
  rowKey: "missing"
};

void invalidTableProps;

const invalidColumnProps: TableColumnProps<Row> = {
  // @ts-expect-error prop should follow generic row type
  prop: "missing"
};

void invalidColumnProps;

// @ts-expect-error invalid sort order should be rejected
const invalidSortOrder: TableSortOrder = "up";

void invalidSortOrder;
