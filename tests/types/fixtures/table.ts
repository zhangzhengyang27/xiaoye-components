import {
  defineTableColumns,
  defineTableProps,
  type TableColumn
} from "xiaoye-components";

interface Row {
  id: number;
  name: string;
  owner: string;
}

const columns = defineTableColumns<Row>([
  {
    key: "name",
    title: "名称",
    dataIndex: "name"
  }
]);

void columns;

const invalidColumns: TableColumn<Row>[] = [
  {
    key: "status",
    title: "状态",
    // @ts-expect-error missing key in row type
    dataIndex: "status"
  }
];

void invalidColumns;

const props = defineTableProps<Row>({
  columns,
  data: [{ id: 1, name: "控制台", owner: "小叶" }],
  rowKey: "id",
  rowClassName: (row) => row.owner
});

void props;

const invalidProps = defineTableProps<Row>({
  columns,
  data: [{ id: 1, name: "控制台", owner: "小叶" }],
  rowKey: "id",
  // @ts-expect-error callback row type should follow generic row type
  rowClassName: (row: { id: string; name: string; owner: string }) => row.name
});

void invalidProps;

const invalidRowKeyProps = defineTableProps<Row>({
  columns,
  data: [{ id: 1, name: "控制台", owner: "小叶" }],
  // @ts-expect-error rowKey should follow generic row type
  rowKey: "status"
});

void invalidRowKeyProps;

const invalidDataProps = defineTableProps<Row>({
  columns,
  data: [
    // @ts-expect-error row data should follow generic row type
    { id: "1", name: "控制台", owner: "小叶" }
  ]
});

void invalidDataProps;
