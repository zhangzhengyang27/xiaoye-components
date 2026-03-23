import Input from "./src/input.vue";
import type { InputAutoSize, InputModelModifiers, InputProps, InputType } from "./src/input";
import { withInstall } from "@xiaoye/utils";

export type { InputAutoSize, InputModelModifiers, InputProps, InputType };

export const XyInput = withInstall(Input, "xy-input");
export default XyInput;
