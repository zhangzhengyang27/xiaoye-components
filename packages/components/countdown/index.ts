import Countdown from "./src/countdown.vue";
import type {
  CountdownChangeHandler,
  CountdownFinishHandler,
  CountdownInstance,
  CountdownProps,
  CountdownValue
} from "./src/countdown";
import { withInstall } from "@xiaoye/utils";

export type {
  CountdownChangeHandler,
  CountdownFinishHandler,
  CountdownInstance,
  CountdownProps,
  CountdownValue
};

export const XyCountdown = withInstall(Countdown, "xy-countdown");
export default XyCountdown;
