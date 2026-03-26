import type { Placement, ReferenceElement } from "@floating-ui/dom";
import type { StyleValue } from "vue";
import type { ButtonProps, ButtonType } from "../../button/src/button";
import type { TooltipEffect, TooltipPopperOptions } from "../../tooltip";
import type Popconfirm from "./popconfirm.vue";

export type PopconfirmEffect = TooltipEffect;
export type PopconfirmButtonType = ButtonType | "text";
export type PopconfirmAction = "confirm" | "cancel";

export interface PopconfirmActionContext {
  action: PopconfirmAction;
  event: MouseEvent;
  close: () => void;
  hide: () => void;
}

export type PopconfirmHook = (
  ctx: PopconfirmActionContext
) => boolean | void | Promise<boolean | void>;

export interface PopconfirmProps {
  modelValue?: boolean;
  title?: string;
  content?: string;
  placement?: Placement;
  disabled?: boolean;
  width?: string | number;
  openDelay?: number;
  closeDelay?: number;
  showAfter?: number;
  hideAfter?: number;
  effect?: PopconfirmEffect;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  persistent?: boolean;
  offset?: number;
  triggerKeys?: string[];
  showArrow?: boolean;
  closeOnEsc?: boolean;
  closeOnOutside?: boolean;
  popperClass?: string;
  popperStyle?: StyleValue;
  transition?: string;
  popperOptions?: TooltipPopperOptions;
  icon?: string;
  iconColor?: string;
  hideIcon?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonType?: PopconfirmButtonType;
  cancelButtonType?: PopconfirmButtonType;
  confirmButtonProps?: Partial<ButtonProps>;
  cancelButtonProps?: Partial<ButtonProps>;
  beforeConfirm?: PopconfirmHook;
  beforeCancel?: PopconfirmHook;
  virtualRef?: ReferenceElement | null;
  virtualTriggering?: boolean;
}

export type PopconfirmInstance = InstanceType<typeof Popconfirm>;
