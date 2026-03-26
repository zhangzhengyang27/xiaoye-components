import Countdown from "./src/countdown.vue";
import type { CountdownProps, CountdownValue } from "./src/countdown";
import { withInstall } from "@xiaoye/utils";

export type { CountdownProps, CountdownValue };

export const XyCountdown = withInstall(Countdown, "xy-countdown");
export default XyCountdown;
