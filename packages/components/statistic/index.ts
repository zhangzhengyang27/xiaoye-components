import Statistic from "./src/statistic.vue";
import type { StatisticFormatter, StatisticInstance, StatisticProps } from "./src/statistic";
import { withInstall } from "@xiaoye/primitives";

export type { StatisticFormatter, StatisticInstance, StatisticProps };

export const XyStatistic = withInstall(Statistic, "xy-statistic");
export default XyStatistic;
