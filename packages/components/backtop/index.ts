import Backtop from "./src/backtop.vue";
import type { BacktopClickHandler, BacktopInstance, BacktopProps } from "./src/backtop";
import { withInstall } from "@xiaoye/primitives";

export type { BacktopClickHandler, BacktopInstance, BacktopProps };

export const XyBacktop = withInstall(Backtop, "xy-backtop");
export default XyBacktop;
