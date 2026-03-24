import TimePicker from "./src/time-picker.vue";
import type { TimePickerProps, TimePickerValue } from "./src/time-picker";
import { withInstall } from "@xiaoye/utils";

export type { TimePickerProps, TimePickerValue };

export const XyTimePicker = withInstall(TimePicker, "xy-time-picker");
export default XyTimePicker;
