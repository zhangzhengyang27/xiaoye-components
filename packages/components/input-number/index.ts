import InputNumber from "./src/input-number.vue";
import type {
  InputNumberChangeHandler,
  InputNumberFocusHandler,
  InputNumberInstance,
  InputNumberProps,
  InputNumberValueChangeHandler
} from "./src/input-number";
import { withInstall } from "@xiaoye/primitives";

export type {
  InputNumberChangeHandler,
  InputNumberFocusHandler,
  InputNumberInstance,
  InputNumberProps,
  InputNumberValueChangeHandler
};

export const XyInputNumber = withInstall(InputNumber, "xy-input-number");
export default XyInputNumber;
