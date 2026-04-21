import { withInstall } from "xiaoye-primitives";
import Rate from "./rate.vue";
import type { RateProps, RateInstance, RateSize } from "./rate";

export type { RateProps, RateInstance, RateSize };

export const XyuRate = withInstall(Rate, "XyuRate");

export default XyuRate;
