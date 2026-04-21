import type { Component, PropType } from "vue";

export const buttonTypes = [
  "default",
  "primary",
  "success",
  "warning",
  "danger",
  "info"
] as const;

export const buttonNativeTypes = ["button", "submit", "reset"] as const;

export type ButtonType = (typeof buttonTypes)[number];
export type ButtonNativeType = (typeof buttonNativeTypes)[number];
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  size?: ButtonSize;
  disabled?: boolean;
  type?: ButtonType;
  icon?: string;
  nativeType?: ButtonNativeType;
  loading?: boolean;
  plain?: boolean;
  text?: boolean;
  link?: boolean;
  autofocus?: boolean;
  round?: boolean;
  circle?: boolean;
  block?: boolean;
  tag?: string | Component;
}

export type ButtonInstance = InstanceType<import("./button.vue").default>;
