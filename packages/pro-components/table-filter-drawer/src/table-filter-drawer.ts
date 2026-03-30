import type { DrawerProps } from "@xiaoye/components";
import type { ProFieldSchema } from "../../core";

export interface TableFilterDrawerProps {
  open?: boolean;
  title?: string;
  model: Record<string, unknown>;
  fields?: ProFieldSchema[];
  drawerProps?: Omit<Partial<DrawerProps>, "modelValue" | "title">;
}
