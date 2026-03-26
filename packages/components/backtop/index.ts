import Backtop from "./src/backtop.vue";
import type { BacktopInstance, BacktopProps } from "./src/backtop";
import { withInstall } from "@xiaoye/utils";

export type { BacktopInstance, BacktopProps };

export const XyBacktop = withInstall(Backtop, "xy-backtop");
export default XyBacktop;
