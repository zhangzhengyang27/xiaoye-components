import StepsForm from "./src/steps-form.vue";
import type {
  StepsFormInstance,
  StepsFormProps,
  StepsFormStep
} from "./src/steps-form";
import { withInstall } from "@xiaoye/utils";

export type { StepsFormInstance, StepsFormProps, StepsFormStep };

export const XyStepsForm = withInstall(StepsForm, "xy-steps-form");

export default XyStepsForm;
