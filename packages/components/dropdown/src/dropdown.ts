import type { Placement, ReferenceElement, Strategy } from "@floating-ui/dom";
import type { StyleValue } from "vue";
import type { ButtonProps } from "../../button/src/button";

export const dropdownRoles = ["menu", "navigation"] as const;
export const dropdownTriggers = ["hover", "click", "contextmenu"] as const;

export type DropdownRole = (typeof dropdownRoles)[number];
export type DropdownTrigger = (typeof dropdownTriggers)[number];
export type DropdownCommand = string | number | Record<string, unknown>;

export interface DropdownItem {
  key: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
  description?: string;
  command?: DropdownCommand;
  divided?: boolean;
  icon?: string;
  textValue?: string;
}

export interface DropdownPopperOptions {
  offset?: number;
  strategy?: Strategy;
  arrowPadding?: number;
  matchTriggerWidth?: boolean;
  shiftPadding?: number;
  flip?: boolean;
}

export interface DropdownSelectItem {
  command?: DropdownCommand;
  disabled?: boolean;
  divided?: boolean;
  icon?: string;
  danger?: boolean;
  description?: string;
  textValue?: string;
}

export interface DropdownProps {
  modelValue?: boolean;
  items?: DropdownItem[];
  placement?: Placement;
  disabled?: boolean;
  hideOnClick?: boolean;
  closeOnSelect?: boolean;
  role?: DropdownRole;
  trigger?: DropdownTrigger | DropdownTrigger[];
  triggerKeys?: string[];
  openDelay?: number;
  closeDelay?: number;
  showAfter?: number;
  hideAfter?: number;
  maxHeight?: string | number;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  persistent?: boolean;
  popperClass?: string;
  popperStyle?: StyleValue;
  showArrow?: boolean;
  virtualRef?: ReferenceElement | null;
  virtualTriggering?: boolean;
  splitButton?: boolean;
  buttonProps?: Partial<ButtonProps>;
  tabindex?: string | number;
  loop?: boolean;
  popperOptions?: DropdownPopperOptions;
}
