import type {
  ColumnSettingPanelColumn,
  ColumnSettingPanelProps
} from "@xiaoye/pro-components";

const columns: ColumnSettingPanelColumn[] = [
  {
    key: "name",
    label: "名称"
  },
  {
    key: "status",
    label: "状态",
    disabled: true
  }
];

const props: ColumnSettingPanelProps = {
  columns,
  modelValue: ["name"]
};

void columns;
void props;
