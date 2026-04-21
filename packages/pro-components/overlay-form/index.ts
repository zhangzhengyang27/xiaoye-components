import OverlayForm from "./src/overlay-form.vue";
import type {
  OverlayFormInstance,
  OverlayFormProps,
  OverlayFormSubmitPayload
} from "./src/overlay-form";
import { withInstall } from "@xiaoye/primitives";

export type {
  OverlayFormInstance,
  OverlayFormProps,
  OverlayFormSubmitPayload
};

export const XyOverlayForm = withInstall(OverlayForm, "xy-overlay-form");

export default XyOverlayForm;
