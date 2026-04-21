import Checkbox from "./src/checkbox.vue";
import CheckboxButton from "./src/checkbox-button.vue";
import CheckboxGroup from "./src/checkbox-group.vue";
import type {
  CheckboxProps,
  CheckboxValue,
  CheckboxValueChangeHandler
} from "./src/checkbox";
import type {
  CheckboxGroupDirection,
  CheckboxGroupProps,
  CheckboxGroupValue,
  CheckboxGroupValueChangeHandler,
  CheckboxOption
} from "./src/checkbox-group";
import type { CheckboxButtonProps } from "./src/checkbox-button";
import { withInstall } from "@xiaoye/primitives";

export type {
  CheckboxButtonProps,
  CheckboxGroupDirection,
  CheckboxGroupProps,
  CheckboxGroupValue,
  CheckboxGroupValueChangeHandler,
  CheckboxOption,
  CheckboxProps,
  CheckboxValue,
  CheckboxValueChangeHandler
};

export const XyCheckbox = withInstall(Checkbox, "xy-checkbox");
export const XyCheckboxButton = withInstall(CheckboxButton, "xy-checkbox-button");
export const XyCheckboxGroup = withInstall(CheckboxGroup, "xy-checkbox-group");
export default XyCheckbox;
