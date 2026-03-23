import Rate from "./src/rate.vue";
import type { RateColorMap, RateIconMap, RateProps } from "./src/rate";
import { withInstall } from "@xiaoye/utils";

export type { RateColorMap, RateIconMap, RateProps };

export const XyRate = withInstall(Rate, "xy-rate");
export default XyRate;
