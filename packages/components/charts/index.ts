import Charts from "./src/charts.vue";
import type {
  ChartsClickHandler,
  ChartsInstance,
  ChartsInstanceHandler,
  ChartsProps
} from "./src/charts";
import type { ChartsModule } from "./src/echarts";
import { withInstall } from "@xiaoye/utils";
import { defaultChartsModules, useChartsModules } from "./src/echarts";

export type {
  ChartsClickHandler,
  ChartsInstance,
  ChartsInstanceHandler,
  ChartsModule,
  ChartsProps
};
export { defaultChartsModules, useChartsModules };

export const XyCharts = withInstall(Charts, "xy-charts");
export default XyCharts;
