import Charts from "./src/charts.vue";
import type { ChartsInstance, ChartsProps } from "./src/charts";
import { withInstall } from "@xiaoye/utils";

export type { ChartsInstance, ChartsProps };

export const XyCharts = withInstall(Charts, "xy-charts");
export default XyCharts;
