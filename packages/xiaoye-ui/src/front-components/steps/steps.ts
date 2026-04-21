export type StepStatus = "wait" | "process" | "finish" | "success" | "error";
export type StepDirection = "horizontal" | "vertical";

export interface StepProps {
  title?: string;
  description?: string;
  status?: StepStatus;
  icon?: string;
  iconSrc?: string;
  disabled?: boolean;
}

export interface StepsProps {
  active?: number;
  direction?: StepDirection;
  alignCenter?: boolean;
  simple?: boolean;
  finishStatus?: StepStatus;
  processStatus?: StepStatus;
}

export type StepsInstance = InstanceType<import("./steps.vue").default>;
export type StepInstance = InstanceType<import("./step.vue").default>;
