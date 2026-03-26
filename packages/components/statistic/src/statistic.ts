import type { StyleValue } from "vue";

export type StatisticFormatter = (value: number | string) => string | number;

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
