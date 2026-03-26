import Step from "./src/step.vue";
import Steps from "./src/steps.vue";
import type { SFCWithInstall } from "@xiaoye/utils";
import { withInstall } from "@xiaoye/utils";
import type { StepProps, StepStatus } from "./src/step";
import type { StepsDirection, StepsProps, StepsStatus } from "./src/steps";

export type { StepProps, StepStatus, StepsDirection, StepsProps, StepsStatus };

export const XyStep = withInstall(Step, "xy-step");

export const XySteps = withInstall(Steps, "xy-steps") as SFCWithInstall<typeof Steps> & {
  Item: typeof XyStep;
};

XySteps.Item = XyStep;

export default XySteps;
