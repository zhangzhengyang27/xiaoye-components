import Statistic from "./src/statistic.vue";
import type { StatisticFormatter, StatisticProps } from "./src/statistic";
import { withInstall } from "@xiaoye/utils";

export type { StatisticFormatter, StatisticProps };

export const XyStatistic = withInstall(Statistic, "xy-statistic");
export default XyStatistic;
