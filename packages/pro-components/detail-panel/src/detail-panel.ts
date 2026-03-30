import type { DialogProps, DrawerProps } from "@xiaoye/components";

export type DetailPanelContainer = "drawer" | "dialog";

export interface DetailPanelProps {
  open?: boolean;
  title?: string;
  description?: string;
  loading?: boolean;
  container?: DetailPanelContainer;
  drawerProps?: Omit<Partial<DrawerProps>, "modelValue" | "title">;
  dialogProps?: Omit<Partial<DialogProps>, "modelValue" | "title">;
}

export interface DetailPanelInstance {
  close: () => void;
}
