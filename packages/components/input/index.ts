import Input from "./src/input.vue";
import type { InputProps } from "./src/input.vue";
import { withInstall } from "@xiaoye/utils";

export type { InputProps };

export const XyInput = withInstall(Input, "xy-input");
export default XyInput;
