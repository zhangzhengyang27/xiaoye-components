import type { SearchFormField, SearchFormProps } from "@xiaoye/pro-components";

const fields: SearchFormField[] = [
  {
    prop: "keyword",
    label: "关键词",
    component: "input"
  },
  {
    prop: "status",
    label: "状态",
    component: "radio-group",
    options: [
      { label: "全部", value: "all" },
      { label: "启用", value: "enabled" }
    ],
    disabled: (model) => model.keyword === "",
    placeholder: "优先级最高的占位文案",
    collapsible: true
  }
];

const props: SearchFormProps = {
  model: {
    keyword: "",
    status: "all"
  },
  fields,
  columns: 3,
  submitOnReset: true
};

void fields;
void props;

const invalidField: SearchFormField = {
  prop: "oops",
  label: "错误字段",
  // @ts-expect-error unsupported builtin component
  component: "color-picker"
};

void invalidField;
