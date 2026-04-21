import { h } from "vue";
import type { ProTableColumn, ProTableInstance, ProTableProps } from "@xiaoye/pro-components";

interface Row {
  id: number;
  name: string;
  status: "enabled" | "disabled";
  budget?: number;
}

const actions: NonNullable<ProTableProps<Row>["toolbarActions"]> = [
  {
    key: "create",
    label: "新建",
    type: "primary"
  }
];

const columns: ProTableColumn<Row>[] = [
  {
    key: "summary",
    label: "摘要信息",
    children: [
      {
        prop: "name",
        label: "名称"
      },
      {
        prop: "status",
        label: "状态",
        slot: "status",
        valueType: "select",
        formatter: (row, _column, value) => `${row.name}:${String(value ?? "-")}`,
        emptyValue: "未设置",
        options: [
          {
            label: "启用",
            value: "enabled"
          },
          {
            label: "停用",
            value: "disabled"
          }
        ],
        hidden: false
      }
    ]
  },
  {
    prop: "name",
    label: "隐藏列",
    hidden: true
  },
  {
    prop: "budget",
    label: "预算",
    valueType: "money"
  },
  {
    prop: "name",
    key: "copy",
    label: "复制",
    valueType: "copy"
  },
  {
    key: "custom",
    label: "自定义",
    render: (value, context) => h("strong", `${context.row.name}:${String(value ?? "-")}`)
  }
];

const props: ProTableProps<Row> = {
  data: [
    {
      id: 1,
      name: "控制台",
      status: "enabled"
    }
  ],
  columns,
  toolbarActions: actions,
  pagination: false,
  draggableRow: true,
  draggableColumn: true,
  workbench: {
    refresh: true,
    density: true,
    columnSetting: true,
    filter: true
  },
  request: {
    request: async () => ({
      data: [],
      total: 0
    }),
    requestParams: {
      tenantId: "demo"
    }
  },
  views: {
    searchModel: {
      keyword: ""
    },
    searchFields: [
      {
        prop: "keyword",
        label: "关键词",
        component: "input"
      }
    ],
    filterModel: {
      status: "enabled"
    },
    filterFields: [
      {
        prop: "status",
        label: "状态",
        component: "select",
        options: [
          {
            label: "启用",
            value: "enabled"
          }
        ]
      }
    ]
  },
  editable: {
    enabled: true,
    mode: "row"
  },
  virtual: {
    enabled: true,
    itemSize: 52
  },
  exportOptions: {
    filename: "members"
  },
  printOptions: {
    title: "成员列表"
  }
};

type ProTableExpose = Pick<
  ProTableInstance<Row>,
  | "clearSelection"
  | "toggleRowSelection"
  | "refreshLayout"
  | "scrollTo"
  | "reload"
  | "refresh"
  | "reset"
  | "toggleFullscreen"
  | "setDensity"
  | "openFilterDrawer"
  | "closeFilterDrawer"
  | "startEdit"
  | "cancelEdit"
  | "submitEdit"
>;

declare const tableExpose: ProTableExpose;

void actions;
void columns;
void props;
void tableExpose;

const invalidActions: NonNullable<ProTableProps<Row>["toolbarActions"]> = [
  {
    key: "oops",
    label: "错误按钮",
    // @ts-expect-error invalid button type should fail
    type: "ghost"
  }
];

void invalidActions;
