import Input from "./src/input.vue";
import type {
  InputAutoSize,
  InputFocusHandler,
  InputInstance,
  InputModelModifiers,
  InputPasswordIconSlotProps,
  InputProps,
  InputType,
  InputValueChangeHandler
} from "./src/input";
import { withInstall } from "@xiaoye/primitives";

export type {
  InputAutoSize,
  InputFocusHandler,
  InputInstance,
  InputModelModifiers,
  InputPasswordIconSlotProps,
  InputProps,
  InputType,
  InputValueChangeHandler
};

export const XyInput = withInstall(Input, "xy-input");
export default XyInput;
