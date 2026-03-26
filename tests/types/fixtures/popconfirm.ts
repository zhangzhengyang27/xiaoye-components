import type { ReferenceElement } from "@floating-ui/dom";
import { h } from "vue";
import {
  XyPopconfirm,
  type PopconfirmAction,
  type PopconfirmActionContext,
  type PopconfirmButtonType,
  type PopconfirmEffect,
  type PopconfirmHook,
  type PopconfirmProps
} from "xiaoye-components";

const virtualRef: ReferenceElement = document.createElement("button");

const beforeConfirm: PopconfirmHook = async (ctx) => {
  const action: PopconfirmAction = ctx.action;
  const event: MouseEvent = ctx.event;

  void action;
  void event;
  ctx.close();
};

const beforeCancel: (ctx: PopconfirmActionContext) => boolean = (ctx) => {
  ctx.hide();
  return true;
};

const popconfirmProps: PopconfirmProps = {
  modelValue: false,
  title: "确定要归档这批记录吗？",
  content: "归档后会移出当前工作台，但不会删除原始数据。",
  placement: "bottom-start",
  width: 240,
  openDelay: 80,
  closeDelay: 90,
  showAfter: 120,
  hideAfter: 160,
  effect: "dark",
  teleported: false,
  appendTo: document.body,
  persistent: true,
  offset: 14,
  triggerKeys: ["F2"],
  showArrow: true,
  closeOnEsc: true,
  closeOnOutside: false,
  popperClass: "custom-popconfirm",
  popperStyle: {
    maxWidth: "320px"
  },
  transition: "xy-fade",
  popperOptions: {
    fallbackPlacements: ["top", "left"],
    arrowPadding: 10
  },
  icon: "mdi:help-circle-outline",
  iconColor: "#f59e0b",
  hideIcon: false,
  confirmButtonText: "立即归档",
  cancelButtonText: "先保留",
  confirmButtonType: "primary",
  cancelButtonType: "text",
  confirmButtonProps: {
    plain: true,
    icon: "mdi:check-bold"
  },
  cancelButtonProps: {
    icon: "mdi:close-thick"
  },
  beforeConfirm,
  beforeCancel,
  virtualRef,
  virtualTriggering: true
};

const effect: PopconfirmEffect = "light";
const buttonType: PopconfirmButtonType = "text";

void popconfirmProps;
void effect;
void buttonType;

const popconfirmComponent = XyPopconfirm as unknown as Parameters<typeof h>[0];

const vnode = h(popconfirmComponent, popconfirmProps, {
  default: ({
    confirm,
    cancel,
    close,
    confirming,
    cancelling
  }: {
    confirm: (event: MouseEvent) => Promise<void>;
    cancel: (event: MouseEvent) => Promise<void>;
    close: () => void;
    confirming: boolean;
    cancelling: boolean;
  }) => [
    h("button", { onClick: close }, "关闭"),
    h("button", { onClick: () => void confirm(new MouseEvent("click")) }, String(confirming)),
    h("button", { onClick: () => void cancel(new MouseEvent("click")) }, String(cancelling))
  ],
  actions: ({
    confirm,
    cancel
  }: {
    confirm: (event: MouseEvent) => Promise<void>;
    cancel: (event: MouseEvent) => Promise<void>;
  }) => [
    h("button", { onClick: () => void cancel(new MouseEvent("click")) }, "取消"),
    h("button", { onClick: () => void confirm(new MouseEvent("click")) }, "确认")
  ]
});

void vnode;

const invalidVisibleProps: PopconfirmProps = {
  // @ts-expect-error visible is not supported
  visible: true
};

const invalidButtonType: PopconfirmProps = {
  // @ts-expect-error info is not supported by current button types
  confirmButtonType: "info"
};

const invalidRawContent: PopconfirmProps = {
  // @ts-expect-error rawContent is not supported
  rawContent: true
};

void invalidVisibleProps;
void invalidButtonType;
void invalidRawContent;
