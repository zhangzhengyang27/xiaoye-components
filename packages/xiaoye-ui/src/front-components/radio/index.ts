import { withInstall } from "xiaoye-primitives";
import Radio from "./radio.vue";
import type { RadioProps, RadioInstance, RadioValue, RadioSize } from "./radio";

export type { RadioProps, RadioInstance, RadioValue, RadioSize };

export const XyuRadio = withInstall(Radio, "XyuRadio");

export default XyuRadio;
