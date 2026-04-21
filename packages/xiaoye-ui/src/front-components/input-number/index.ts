import { withInstall } from "xiaoye-primitives";
import InputNumber from "./input-number.vue";
import type { InputNumberProps, InputNumberInstance, InputNumberSize } from "./input-number";

export type { InputNumberProps, InputNumberInstance, InputNumberSize };

export const XyuInputNumber = withInstall(InputNumber, "XyuInputNumber");

export default XyuInputNumber;
