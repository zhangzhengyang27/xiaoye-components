import DatePicker from "./src/date-picker.vue";
import type {
  DatePickerProps,
  DatePickerShortcut,
  DatePickerType,
  DatePickerValue
} from "./src/date-picker";
import { withInstall } from "@xiaoye/utils";

export type { DatePickerProps, DatePickerShortcut, DatePickerType, DatePickerValue };

export const XyDatePicker = withInstall(DatePicker, "xy-date-picker");
export default XyDatePicker;
