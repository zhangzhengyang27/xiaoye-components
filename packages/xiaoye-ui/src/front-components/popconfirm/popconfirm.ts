import type { PopoverPlacement, PopoverTrigger } from "../popover/popover";

export interface PopconfirmProps {
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
  iconType?: "info" | "warning" | "danger" | "success";
  placement?: PopoverPlacement;
  trigger?: PopoverTrigger;
  disabled?: boolean;
  confirmButtonType?: "primary" | "danger" | "default";
  cancelButtonType?: "default" | "text";
  persistent?: boolean;
}

export interface PopconfirmEmits {
  (e: "confirm"): void;
  (e: "cancel"): void;
  (e: "update:visible", value: boolean): void;
}

export type PopconfirmInstance = InstanceType<import("./popconfirm.vue").default>;
