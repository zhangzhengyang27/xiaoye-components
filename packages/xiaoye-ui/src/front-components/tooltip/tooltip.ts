export type TooltipPlacement = "top" | "bottom" | "left" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end";
export type TooltipTrigger = "hover" | "focus" | "click";

export interface TooltipProps {
  content?: string;
  placement?: TooltipPlacement;
  trigger?: TooltipTrigger;
  disabled?: boolean;
  delay?: number;
  offset?: number;
  maxWidth?: number | string;
}

export type TooltipInstance = InstanceType<import("./tooltip.vue").default>;
