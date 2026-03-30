import type { TreeSelectProps } from "xiaoye-components";

const props: TreeSelectProps = {
  modelValue: 1,
  data: [{ id: 1, label: "控制台" }],
  nodeKey: "id",
  filterable: true,
  clearable: true
};

void props;

const invalidProps: TreeSelectProps = {
  // @ts-expect-error modelValue should be tree key
  modelValue: [],
  data: [{ id: 1, label: "控制台" }],
  nodeKey: "id"
};

void invalidProps;
