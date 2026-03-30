import Form from "./src/form.vue";
import FormItem from "./src/form-item.vue";
import type { FormProps } from "./src/context";
import type { FormItemProps } from "./src/form-item.vue";
import type { FormRules, XyFormRule } from "./src/context";
import type { FormProp } from "./src/utils";
import { withInstall } from "@xiaoye/utils";

export type { FormProps, FormItemProps, FormRules, XyFormRule, FormProp };

export const XyForm = withInstall(Form, "xy-form");
export const XyFormItem = withInstall(FormItem, "xy-form-item");

export default XyForm;
