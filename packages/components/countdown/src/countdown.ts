import type Countdown from "./countdown.vue";
import type { StyleValue } from "vue";
import type { Dayjs } from "dayjs";

export type CountdownValue = number | Date | Dayjs;
export type CountdownChangeHandler = (remainingMs: number) => void;
export type CountdownFinishHandler = () => void;

export interface CountdownProps {
  value?: CountdownValue;
  format?: string;
  title?: string;
  prefix?: string;
  suffix?: string;
  valueStyle?: StyleValue;
}

export type CountdownInstance = InstanceType<typeof Countdown>;
