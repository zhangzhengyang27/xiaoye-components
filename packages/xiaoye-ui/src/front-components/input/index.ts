import { withInstall } from "xiaoye-primitives";
import Input from "./input.vue";
import type { InputProps, InputInstance, InputSize } from "./input";

export type { InputProps, InputInstance, InputSize };

export const XyuInput = withInstall(Input, "XyuInput");

export default XyuInput;
