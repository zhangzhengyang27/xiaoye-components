import type {
  OverlayFormInstance,
  OverlayFormProps,
  OverlayFormSubmitPayload
} from "../../overlay-form/src/overlay-form";

export interface DialogFormProps extends Omit<OverlayFormProps, "container" | "drawerProps"> {}

export type DialogFormSubmitPayload = OverlayFormSubmitPayload;
export type DialogFormInstance = OverlayFormInstance;
