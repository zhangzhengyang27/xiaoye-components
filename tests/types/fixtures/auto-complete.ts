import type { AutoCompleteProps } from "xiaoye-components";

const props: AutoCompleteProps<number> = {
  modelValue: "控制台",
  options: [{ label: "控制台", value: 1 }],
  remote: true,
  loading: true
};

void props;

const invalidProps: AutoCompleteProps<number> = {
  // @ts-expect-error modelValue should be string
  modelValue: 1,
  options: [{ label: "控制台", value: 1 }]
};

void invalidProps;
