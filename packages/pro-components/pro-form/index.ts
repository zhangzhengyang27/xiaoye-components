import ProForm from "./src/pro-form.vue";
import type { ProFormInstance, ProFormProps } from "./src/pro-form";
import { withInstall } from "@xiaoye/utils";

export type { ProFormInstance, ProFormProps };

export const XyProForm = withInstall(ProForm, "xy-pro-form");

export default XyProForm;
