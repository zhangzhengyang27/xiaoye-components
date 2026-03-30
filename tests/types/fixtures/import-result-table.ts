import type {
  ImportResultSummary,
  ImportResultTableProps
} from "@xiaoye/pro-components";

interface Row {
  id: number;
  name: string;
}

const summary: ImportResultSummary = {
  total: 1,
  success: 1,
  failed: 0
};

const props: ImportResultTableProps<Row> = {
  data: [
    {
      id: 1,
      name: "导入结果"
    }
  ],
  columns: [
    {
      prop: "name",
      label: "名称"
    }
  ],
  summary
};

void summary;
void props;
