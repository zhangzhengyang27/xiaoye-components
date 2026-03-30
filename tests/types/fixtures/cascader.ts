import type { CascaderProps } from "xiaoye-components";

const props: CascaderProps = {
  modelValue: [1, 11],
  options: [
    {
      value: 1,
      label: "工作台",
      children: [{ value: 11, label: "账单中心" }]
    }
  ],
  filterable: true,
  clearable: true
};

void props;

const invalidProps: CascaderProps = {
  // @ts-expect-error modelValue should be path array
  modelValue: 1,
  options: [{ value: 1, label: "工作台" }]
};

void invalidProps;
