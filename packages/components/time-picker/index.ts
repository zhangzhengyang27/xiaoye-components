import TimePicker from "./src/time-picker.vue";
import type {
  TimePickerChangeHandler,
  TimePickerModelValueChangeHandler,
  TimePickerProps,
  TimePickerValue,
  TimePickerVisibleChangeHandler
} from "./src/time-picker";
import { withInstall } from "@xiaoye/primitives";

export type {
  TimePickerChangeHandler,
  TimePickerModelValueChangeHandler,
  TimePickerProps,
  TimePickerValue,
  TimePickerVisibleChangeHandler
};

export const XyTimePicker = withInstall(TimePicker, "xy-time-picker");
export default XyTimePicker;
