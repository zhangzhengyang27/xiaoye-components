import type Switch from "./switch.vue";
import type { ComponentSize } from "@xiaoye/utils";

export type SwitchValue = boolean | string | number;
export type SwitchValueChangeHandler = (value: SwitchValue) => void;
export type SwitchFocusHandler = (event: FocusEvent) => void;

export interface SwitchProps {
  modelValue?: SwitchValue;
  disabled?: boolean;
  loading?: boolean;
  size?: ComponentSize;
  width?: string | number;
  inlinePrompt?: boolean;
  inactiveActionIcon?: string;
  activeActionIcon?: string;
  activeIcon?: string;
  inactiveIcon?: string;
  activeText?: string;
  inactiveText?: string;
  activeValue?: SwitchValue;
  inactiveValue?: SwitchValue;
  name?: string;
  validateEvent?: boolean;
  beforeChange?: () => Promise<boolean> | boolean;
  id?: string;
  tabindex?: string | number;
  ariaLabel?: string;
}

export type SwitchInstance = InstanceType<typeof Switch>;

export const DEFAULT_LOADING_ICON = "mdi:loading";
