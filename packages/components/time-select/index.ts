import TimeSelect from "./src/time-select.vue";
import type {
  TimeSelectInstance,
  TimeSelectOption,
  TimeSelectProps,
  TimeSelectValueChangeHandler,
  TimeSelectVisibleChangeHandler
} from "./src/time-select";
import { withInstall } from "@xiaoye/utils";

export type {
  TimeSelectInstance,
  TimeSelectOption,
  TimeSelectProps,
  TimeSelectValueChangeHandler,
  TimeSelectVisibleChangeHandler
};

export const XyTimeSelect = withInstall(TimeSelect, "xy-time-select");
export default XyTimeSelect;
