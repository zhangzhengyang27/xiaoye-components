import DrawerForm from "./src/drawer-form.vue";
import type {
  DrawerFormInstance,
  DrawerFormProps,
  DrawerFormSubmitPayload
} from "./src/drawer-form";
import { withInstall } from "@xiaoye/primitives";

export type {
  DrawerFormInstance,
  DrawerFormProps,
  DrawerFormSubmitPayload
};

export const XyDrawerForm = withInstall(DrawerForm, "xy-drawer-form");

export default XyDrawerForm;
