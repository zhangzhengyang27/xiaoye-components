import Rate from "./src/rate.vue";
import type {
  RateColorMap,
  RateFocusHandler,
  RateIconMap,
  RateInstance,
  RateProps,
  RateValueChangeHandler
} from "./src/rate";
import { withInstall } from "@xiaoye/utils";

export type {
  RateColorMap,
  RateFocusHandler,
  RateIconMap,
  RateInstance,
  RateProps,
  RateValueChangeHandler
};

export const XyRate = withInstall(Rate, "xy-rate");
export default XyRate;
