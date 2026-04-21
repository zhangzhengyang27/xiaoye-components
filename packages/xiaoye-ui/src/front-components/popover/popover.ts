export type PopoverPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end"
  | "left-start"
  | "left-end"
  | "right-start"
  | "right-end";

export type PopoverTrigger = "hover" | "click" | "focus" | "manual";

export interface PopoverProps {
  content?: string;
  title?: string;
  placement?: PopoverPlacement;
  trigger?: PopoverTrigger;
  disabled?: boolean;
  delay?: number;
  offset?: number;
  width?: number | string;
  maxWidth?: number | string;
  showArrow?: boolean;
  transitionName?: string;
  appendToBody?: boolean;
  visible?: boolean;
}

export interface PopoverEmits {
  (e: "update:visible", value: boolean): void;
  (e: "show"): void;
  (e: "hide"): void;
}

export type PopoverInstance = InstanceType<import("./popover.vue").default>;
