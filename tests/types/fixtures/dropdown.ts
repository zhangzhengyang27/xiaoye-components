import { h } from "vue";
import type { ButtonProps } from "xiaoye-components";
import {
  XyDropdown,
  XyDropdownItem,
  XyDropdownMenu,
  type DropdownItem,
  type DropdownItemProps,
  type DropdownProps
} from "xiaoye-components";

const buttonProps: Partial<ButtonProps> = {
  type: "primary",
  plain: true
};

const dropdownProps: DropdownProps = {
  trigger: ["click", "contextmenu"],
  triggerKeys: ["Enter", "F2"],
  splitButton: true,
  buttonProps,
  showArrow: true,
  virtualRef: document.body,
  virtualTriggering: true,
  popperOptions: {
    strategy: "absolute",
    offset: 12,
    arrowPadding: 10,
    matchTriggerWidth: true,
    shiftPadding: 16,
    flip: false
  }
};

const items: DropdownItem[] = [
  {
    key: "edit",
    label: "编辑成员"
  },
  {
    key: "delete",
    label: "删除成员",
    danger: true,
    divided: true,
    icon: "mdi:delete-outline"
  }
];

const dropdownItemProps: DropdownItemProps = {
  command: "archive",
  icon: "mdi:archive-outline",
  divided: true,
  description: "归档后将移出当前视图"
};

void dropdownProps;
void items;
void dropdownItemProps;

const dropdownVNode = h(XyDropdown, dropdownProps, {
  default: () => "更多操作",
  dropdown: () =>
    h(XyDropdownMenu, null, () => [
      h(XyDropdownItem, dropdownItemProps, () => "归档"),
      h(XyDropdown.Item, { command: "delete", danger: true }, () => "删除")
    ])
});

const legacyDropdownVNode = h(XyDropdown, {
  items
});

void dropdownVNode;
void legacyDropdownVNode;

const invalidDropdownProps: DropdownProps = {
  // @ts-expect-error invalid trigger should be rejected
  trigger: "focus"
};

const invalidDropdownItemProps: DropdownItemProps = {
  // @ts-expect-error invalid icon type should be rejected
  icon: 1
};

const invalidPopperOptions: DropdownProps = {
  popperOptions: {
    // @ts-expect-error invalid strategy should be rejected
    strategy: "sticky"
  }
};

void invalidDropdownProps;
void invalidDropdownItemProps;
void invalidPopperOptions;
