import InputNumber from "./src/input-number.vue";
import type { InputNumberProps } from "./src/input-number";
import { withInstall } from "@xiaoye/utils";

export type { InputNumberProps };

export const XyInputNumber = withInstall(InputNumber, "xy-input-number");
export default XyInputNumber;
