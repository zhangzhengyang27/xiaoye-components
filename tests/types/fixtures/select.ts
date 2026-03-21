import type { SelectOption, SelectProps } from "xiaoye-components";

const options: SelectOption<number>[] = [
  { label: "管理员", value: 1 },
  { label: "成员", value: 2 }
];

const props: SelectProps<number> = {
  options,
  modelValue: 1
};

void props;

const invalidProps: SelectProps<number> = {
  options,
  // @ts-expect-error modelValue type should follow generic
  modelValue: "admin"
};

void invalidProps;
