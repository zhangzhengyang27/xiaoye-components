import type { Component } from "vue";
import type { ComponentSize } from "@xiaoye/utils";

export const buttonTypes = [
  "default",
  "primary",
  "success",
  "warning",
  "danger"
] as const;

export const buttonNativeTypes = ["button", "submit", "reset"] as const;

export type ButtonType = (typeof buttonTypes)[number];
export type ButtonNativeType = (typeof buttonNativeTypes)[number];

export const DEFAULT_LOADING_ICON = "mdi:loading";

export interface ButtonProps {
  size?: ComponentSize;
  disabled?: boolean;
  type?: ButtonType;
  icon?: string;
  nativeType?: ButtonNativeType;
  loading?: boolean;
  loadingIcon?: string;
  plain?: boolean;
  text?: boolean;
  link?: boolean;
  bg?: boolean;
  autofocus?: boolean;
  round?: boolean;
  circle?: boolean;
  block?: boolean;
  tag?: string | Component;
}
