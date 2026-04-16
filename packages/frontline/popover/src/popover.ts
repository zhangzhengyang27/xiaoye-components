import type { Placement } from "@floating-ui/dom";

export const frontPopoverSurfaces = ["default", "highlight"] as const;
export type FrontPopoverSurface = (typeof frontPopoverSurfaces)[number];

export interface FrontPopoverProps {
  modelValue?: boolean;
  title?: string;
  content?: string;
  placement?: Placement;
  width?: number | string;
  trigger?: "click" | "hover" | "focus" | "manual";
  surface?: FrontPopoverSurface;
}
