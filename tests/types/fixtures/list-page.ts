import type {
  ListPageActionRef,
  ListPageBatchAction,
  ListPageProps
} from "@xiaoye/pro-components";

interface Row {
  id: number;
  name: string;
}

const props: ListPageProps<Row> = {
  title: "成员列表",
  columns: [
    {
      prop: "name",
      label: "名称"
    }
  ],
  data: [
    {
      id: 1,
      name: "小叶"
    }
  ],
  pageSize: 20
};

const batchActions: ListPageBatchAction[] = [
  {
    key: "archive",
    label: "批量归档",
    danger: true
  }
];

type ListPageExpose = Pick<ListPageActionRef, "reload" | "refresh" | "reset" | "clearSelection">;

declare const listPageExpose: ListPageExpose;

void props;
void batchActions;
void listPageExpose;
