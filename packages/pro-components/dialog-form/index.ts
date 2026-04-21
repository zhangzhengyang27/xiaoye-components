import DialogForm from "./src/dialog-form.vue";
import type {
  DialogFormInstance,
  DialogFormProps,
  DialogFormSubmitPayload
} from "./src/dialog-form";
import { withInstall } from "@xiaoye/primitives";

export type {
  DialogFormInstance,
  DialogFormProps,
  DialogFormSubmitPayload
};

export const XyDialogForm = withInstall(DialogForm, "xy-dialog-form");

export default XyDialogForm;
