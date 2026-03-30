import type { DialogProps, DrawerProps, FormRules } from "@xiaoye/components";
import type { ComponentSize } from "@xiaoye/utils";
import type { ProFieldSchema } from "../../core";

export type OverlayFormContainer = "drawer" | "modal";
export const overlayFormModes = ["create", "edit", "view"] as const;
export type OverlayFormMode = (typeof overlayFormModes)[number];

export interface OverlayFormSubmitPayload {
  mode: OverlayFormMode;
  model: Record<string, unknown>;
}

export interface OverlayFormProps {
  open?: boolean;
  container?: OverlayFormContainer;
  mode?: OverlayFormMode;
  title?: string;
  model: Record<string, unknown>;
  schema?: ProFieldSchema[];
  rules?: FormRules;
  labelWidth?: string | number;
  labelPosition?: "left" | "top";
  size?: ComponentSize;
  loading?: boolean;
  submitting?: boolean;
  readonly?: boolean;
  submitText?: string;
  cancelText?: string;
  resetOnClose?: boolean;
  destroyOnClose?: boolean;
  drawerProps?: Omit<Partial<DrawerProps>, "modelValue" | "title">;
  dialogProps?: Omit<Partial<DialogProps>, "modelValue" | "title">;
}

export interface OverlayFormInstance {
  validate: () => Promise<boolean>;
  submit: () => Promise<boolean>;
  close: () => void;
}
