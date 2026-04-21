import Step from "./src/step.vue";
import Steps from "./src/steps.vue";
import type { SFCWithInstall } from "@xiaoye/primitives";
import { withInstall } from "@xiaoye/primitives";
import type { StepProps, StepStatus } from "./src/step";
import type { StepsChangeHandler, StepsDirection, StepsProps, StepsStatus } from "./src/steps";

export type { StepProps, StepStatus, StepsChangeHandler, StepsDirection, StepsProps, StepsStatus };

export const XyStep = withInstall(Step, "xy-step");

export const XySteps = withInstall(Steps, "xy-steps") as SFCWithInstall<
  typeof Steps
> & {
  Item: typeof XyStep;
};

XySteps.Item = XyStep;

export default XySteps;
