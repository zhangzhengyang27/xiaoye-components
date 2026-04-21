import type { DescriptionsProps, DialogProps, DrawerProps } from "@xiaoye/components";
import type { ProFieldSchema } from "../../core";

export type DetailPanelContainer = "drawer" | "dialog";

export interface DetailPanelProps {
  open?: boolean;
  title?: string;
  description?: string;
  loading?: boolean;
  container?: DetailPanelContainer;
  model?: Record<string, unknown>;
  schema?: ProFieldSchema[];
  descriptionsProps?: Omit<DescriptionsProps, "items" | "title" | "extra">;
  drawerProps?: Omit<Partial<DrawerProps>, "modelValue" | "title">;
  dialogProps?: Omit<Partial<DialogProps>, "modelValue" | "title">;
}

export interface DetailPanelInstance {
  close: () => void;
}
