import { withInstall } from "xiaoye-primitives";
import DatePicker from "./date-picker.vue";
import type { DatePickerProps, DatePickerEmits, DatePickerInstance, DatePickerType } from "./date-picker";

export type { DatePickerProps, DatePickerEmits, DatePickerInstance, DatePickerType };

export const XyuDatePicker = withInstall(DatePicker, "XyuDatePicker");

export default XyuDatePicker;
