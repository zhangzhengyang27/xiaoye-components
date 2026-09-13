import type {
  OverlayFormInstance,
  OverlayFormProps,
  OverlayFormSubmitPayload
} from "../../overlay-form/src/overlay-form";

export type DrawerFormProps = Omit<OverlayFormProps, "container" | "dialogProps">;

export type DrawerFormSubmitPayload = OverlayFormSubmitPayload;
export type DrawerFormInstance = OverlayFormInstance;
