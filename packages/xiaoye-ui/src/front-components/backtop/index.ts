import { withInstall } from "xiaoye-primitives";
import Backtop from "./backtop.vue";
import type { BacktopProps, BacktopEmits, BacktopInstance } from "./backtop";

export type { BacktopProps, BacktopEmits, BacktopInstance };

export const XyuBacktop = withInstall(Backtop, "XyuBacktop");

export default XyuBacktop;
