import type { StepsStatus } from "./steps";

export type StepStatus = "" | StepsStatus;

export interface StepProps {
  title?: string;
  icon?: string;
  description?: string;
  status?: StepStatus;
}
