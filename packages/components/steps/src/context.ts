import type { CSSProperties, ComputedRef, InjectionKey, Ref, ShallowRef } from "vue";
import type { StepStatus } from "./step";
import type { StepsDirection, StepsStatus } from "./steps";

export interface StepState {
  uid: number;
  el: Ref<HTMLElement | null>;
  index: Ref<number>;
  internalStatus: Ref<StepsStatus>;
  currentStatus: ComputedRef<StepStatus>;
  lineStyle: Ref<CSSProperties>;
  setIndex: (value: number) => void;
  calcProgress: (status: StepsStatus, active: number, previousActive: number) => void;
}

export interface StepsContext {
  active: ComputedRef<number>;
  direction: ComputedRef<StepsDirection>;
  alignCenter: ComputedRef<boolean>;
  simple: ComputedRef<boolean>;
  space: ComputedRef<number | string>;
  finishStatus: ComputedRef<StepsStatus>;
  processStatus: ComputedRef<StepsStatus>;
  steps: ShallowRef<StepState[]>;
  addStep: (step: StepState) => void;
  removeStep: (uid: number) => void;
  orderSteps: () => void;
}

export const stepsContextKey: InjectionKey<StepsContext> = Symbol("xiaoye-steps");
