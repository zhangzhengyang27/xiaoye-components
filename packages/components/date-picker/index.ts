import DatePicker from "./src/date-picker.vue";
import type { DatePickerProps } from "./src/date-picker.vue";
import { withInstall } from "@xiaoye/utils";

export type { DatePickerProps };

export const XyDatePicker = withInstall(DatePicker, "xy-date-picker");
export default XyDatePicker;

