import type { ComputedRef, InjectionKey, Ref } from "vue";
import type { ComponentSize } from "@xiaoye/utils";
import type { CheckboxValue } from "./checkbox";
import type { CheckboxGroupValue } from "./checkbox-group";

export interface CheckboxGroupContext {
  modelValue: Ref<CheckboxGroupValue>;
  disabled: Ref<boolean>;
  size: ComputedRef<ComponentSize>;
  name: ComputedRef<string>;
  fill: Ref<string | undefined>;
  textColor: Ref<string | undefined>;
  min: Ref<number | undefined>;
  max: Ref<number | undefined>;
  changeValue: (value: CheckboxValue) => Promise<void>;
}

export const checkboxGroupContextKey: InjectionKey<CheckboxGroupContext> = Symbol(
  "xiaoye-checkbox-group"
);
