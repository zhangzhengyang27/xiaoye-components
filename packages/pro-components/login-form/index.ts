import LoginForm from "./src/login-form.vue";
import type {
  LoginFormInstance,
  LoginFormModel,
  LoginFormProps,
  LoginFormThirdPartyItem
} from "./src/login-form";
import { withInstall } from "@xiaoye/utils";

export type {
  LoginFormInstance,
  LoginFormModel,
  LoginFormProps,
  LoginFormThirdPartyItem
};

export const XyLoginForm = withInstall(LoginForm, "xy-login-form");
export default XyLoginForm;
