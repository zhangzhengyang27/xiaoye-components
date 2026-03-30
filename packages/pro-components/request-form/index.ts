import RequestForm from "./src/request-form.vue";
import type { RequestFormProps, RequestFormSubmitContext } from "./src/request-form";
import { withInstall } from "@xiaoye/utils";

export type { RequestFormProps, RequestFormSubmitContext };

export const XyRequestForm = withInstall(RequestForm, "xy-request-form");

export default XyRequestForm;
