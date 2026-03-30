import type { CrudPageProps } from "@xiaoye/pro-components";

interface Row {
  id: number;
  name: string;
}

const props: CrudPageProps<Row> = {
  title: "成员管理",
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
  formModel: {
    name: ""
  },
  formType: "drawer",
  detailType: "dialog"
};

void props;
