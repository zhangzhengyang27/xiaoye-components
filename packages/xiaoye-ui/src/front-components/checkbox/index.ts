import { withInstall } from "xiaoye-primitives";
import Checkbox from "./checkbox.vue";
import type { CheckboxProps, CheckboxInstance, CheckboxValue, CheckboxSize } from "./checkbox";

export type { CheckboxProps, CheckboxInstance, CheckboxValue, CheckboxSize };

export const XyuCheckbox = withInstall(Checkbox, "XyuCheckbox");

export default XyuCheckbox;
