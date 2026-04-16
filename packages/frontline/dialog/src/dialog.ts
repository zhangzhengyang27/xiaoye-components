export const frontDialogSizes = ["sm", "md", "lg", "xl"] as const;
export const frontDialogSurfaces = ["default", "floating"] as const;

export type FrontDialogSize = (typeof frontDialogSizes)[number];
export type FrontDialogSurface = (typeof frontDialogSurfaces)[number];

export interface FrontDialogProps {
  modelValue?: boolean;
  title?: string;
  description?: string;
  size?: FrontDialogSize;
  surface?: FrontDialogSurface;
  dismissible?: boolean;
  showClose?: boolean;
}
