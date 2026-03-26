import type { StyleValue } from "vue";
import type { Dayjs } from "dayjs";

export type CountdownValue = number | Date | Dayjs;

export interface CountdownProps {
  value?: CountdownValue;
  format?: string;
  title?: string;
  prefix?: string;
  suffix?: string;
  valueStyle?: StyleValue;
}
