import DatePicker from "./src/date-picker.vue";
import type {
  DatePickerProps,
  DatePickerShortcut,
  DatePickerType,
  DatePickerValue,
  DatePickerValueChangeHandler,
  DatePickerVisibleChangeHandler
} from "./src/date-picker";
import { withInstall } from "@xiaoye/primitives";

export type {
  DatePickerProps,
  DatePickerShortcut,
  DatePickerType,
  DatePickerValue,
  DatePickerValueChangeHandler,
  DatePickerVisibleChangeHandler
};

export const XyDatePicker = withInstall(DatePicker, "xy-date-picker");
export default XyDatePicker;
