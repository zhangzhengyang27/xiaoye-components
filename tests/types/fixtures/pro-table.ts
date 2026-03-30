import type {
  ProTableColumn,
  ProTableInstance,
  ProTableProps
} from "@xiaoye/pro-components";

interface Row {
  id: number;
  name: string;
  status: "enabled" | "disabled";
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
        hidden: false
      }
    ]
  },
  {
    prop: "name",
    label: "隐藏列",
    hidden: true
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
  draggableColumn: true
};

type ProTableExpose = Pick<
  ProTableInstance<Row>,
  "clearSelection" | "toggleRowSelection" | "refreshLayout" | "scrollTo"
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
