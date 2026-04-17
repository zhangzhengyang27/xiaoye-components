import type { StyleValue } from "vue";
import type Statistic from "./statistic.vue";

export type StatisticFormatter = (value: number | string) => string | number;
export type StatisticInstance = InstanceType<typeof Statistic>;

export interface StatisticProps {
  value?: number | string;
  title?: string;
  prefix?: string;
  suffix?: string;
  precision?: number;
  decimalSeparator?: string;
  groupSeparator?: string;
  formatter?: StatisticFormatter;
  valueStyle?: StyleValue;
}
