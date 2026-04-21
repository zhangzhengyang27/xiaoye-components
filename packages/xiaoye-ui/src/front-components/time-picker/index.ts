import { withInstall } from "xiaoye-primitives";
import TimePicker from "./time-picker.vue";
import type { TimePickerProps, TimePickerEmits, TimePickerInstance } from "./time-picker";

export type { TimePickerProps, TimePickerEmits, TimePickerInstance };

export const XyuTimePicker = withInstall(TimePicker, "XyuTimePicker");

export default XyuTimePicker;
