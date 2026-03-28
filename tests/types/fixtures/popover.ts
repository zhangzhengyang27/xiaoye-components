import type { PopoverProps } from "xiaoye-components";

const props: PopoverProps = {
  modelValue: true,
  title: "审批说明",
  content: "请确认是否继续当前操作。",
  placement: "bottom-start",
  width: 360,
  closeOnOutside: true,
  closeOnEsc: true,
  trigger: "click",
  openDelay: 120,
  closeDelay: 80,
  enterable: true,
  offset: 12,
  showArrow: true,
  teleported: true,
  appendTo: "body",
  persistent: false,
  popperClass: "approval-popover",
  popperStyle: {
    maxWidth: "420px"
  }
};

void props;

const invalidProps: PopoverProps = {
  // @ts-expect-error unsupported trigger should be rejected
  trigger: "contextmenu"
};

void invalidProps;
