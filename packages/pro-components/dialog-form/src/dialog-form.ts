import type {
  OverlayFormInstance,
  OverlayFormProps,
  OverlayFormSubmitPayload
} from "../../overlay-form/src/overlay-form";

export type DialogFormProps = Omit<OverlayFormProps, "container" | "drawerProps">;

export type DialogFormSubmitPayload = OverlayFormSubmitPayload;
export type DialogFormInstance = OverlayFormInstance;
