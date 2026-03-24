import TimeSelect from "./src/time-select.vue";
import type { TimeSelectOption, TimeSelectProps } from "./src/time-select";
import { withInstall } from "@xiaoye/utils";

export type { TimeSelectOption, TimeSelectProps };

export const XyTimeSelect = withInstall(TimeSelect, "xy-time-select");
export default XyTimeSelect;
