import { withInstall } from "xiaoye-primitives";
import Steps from "./steps.vue";
import Step from "./step.vue";
import type { StepsProps, StepsInstance, StepProps, StepInstance, StepStatus, StepDirection } from "./steps";

export type { StepsProps, StepsInstance, StepProps, StepInstance, StepStatus, StepDirection };

export const XyuSteps = withInstall(Steps, "XyuSteps");
export const XyuStep = withInstall(Step, "XyuStep");

export default XyuSteps;
