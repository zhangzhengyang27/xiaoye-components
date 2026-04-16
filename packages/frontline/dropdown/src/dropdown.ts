import type { DropdownItem, DropdownTrigger } from "@xiaoye/components/dropdown/src/dropdown";

export const frontDropdownSurfaces = ["default", "highlight"] as const;
export type FrontDropdownSurface = (typeof frontDropdownSurfaces)[number];

export interface FrontDropdownProps {
  modelValue?: boolean;
  items?: DropdownItem[];
  trigger?: DropdownTrigger | DropdownTrigger[];
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
  title?: string;
  surface?: FrontDropdownSurface;
}
