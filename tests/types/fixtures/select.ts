import type { SelectOption, SelectOptionGroup, SelectProps } from "xiaoye-components";

const options: SelectOption<number>[] = [
  { label: "管理员", value: 1 },
  { label: "成员", value: 2 }
];

const groupedOptions: SelectOptionGroup<number>[] = [
  {
    label: "系统角色",
    options
  }
];

const props: SelectProps<number> = {
  options: [...options, ...groupedOptions],
  modelValue: 1,
  loading: true,
  loadingText: "加载中",
  searchPlaceholder: "搜索角色",
  prefixIcon: "mdi:magnify",
  suffixIcon: "mdi:chevron-down",
  clearIcon: "mdi:close-circle"
};

void props;

const invalidProps: SelectProps<number> = {
  options,
  // @ts-expect-error modelValue type should follow generic
  modelValue: "admin"
};

void invalidProps;

const invalidGroupProps: SelectProps<number> = {
  options: [
    {
      label: "错误分组",
      // @ts-expect-error group options should follow generic type
      options: [{ label: "管理员", value: "admin" }]
    }
  ]
};

void invalidGroupProps;
