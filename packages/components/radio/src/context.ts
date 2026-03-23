import type { ComputedRef, InjectionKey, Ref } from "vue";
import type { ComponentSize } from "@xiaoye/utils";
import type { RadioValue } from "./radio";

export interface RadioGroupContext {
  modelValue: Ref<RadioValue | undefined>;
  disabled: Ref<boolean>;
  size: ComputedRef<ComponentSize>;
  name: ComputedRef<string>;
  fill: Ref<string | undefined>;
  textColor: Ref<string | undefined>;
  changeValue: (value: RadioValue) => Promise<void>;
}

export const radioGroupContextKey: InjectionKey<RadioGroupContext> = Symbol(
  "xiaoye-radio-group"
);
