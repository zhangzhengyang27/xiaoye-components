import FrontInput from "./src/front-input.vue";
import type { FrontInputProps, FrontInputSize, FrontInputVariant } from "./src/input";
import { withInstall } from "@xiaoye/utils";

export type { FrontInputProps, FrontInputSize, FrontInputVariant };

export const XyFrontInput = withInstall(FrontInput, "xy-front-input");
export default XyFrontInput;
