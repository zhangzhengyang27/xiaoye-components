import type { TabItem, TabsProps } from "xiaoye-components";

const items: TabItem[] = [
  { key: "overview", label: "概览" },
  { key: "members", label: "成员", disabled: true, closable: false }
];

const tabsProps: TabsProps = {
  modelValue: "overview",
  defaultValue: "members",
  items,
  type: "card",
  tabPosition: "left",
  closable: true,
  addable: true,
  editable: false,
  stretch: true,
  beforeLeave: (_next, _prev) => true,
  tabindex: 0
};

void tabsProps;

const invalidTabsProps: TabsProps = {
  items,
  // @ts-expect-error invalid type should be rejected
  type: "editable"
};

void invalidTabsProps;
