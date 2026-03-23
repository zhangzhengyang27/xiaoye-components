import type { InjectionKey, Ref } from "vue";
import type { ComponentSize } from "@xiaoye/utils";
import type { ButtonType } from "./button";

export interface ButtonGroupContext {
  size: Ref<ComponentSize | undefined>;
  type: Ref<ButtonType | undefined>;
}

export const buttonGroupContextKey: InjectionKey<ButtonGroupContext> =
  Symbol("xiaoye-button-group");
