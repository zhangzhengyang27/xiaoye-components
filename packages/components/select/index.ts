import Select from "./src/select.vue";
import type { SelectProps } from "./src/select.vue";
import { withInstall } from "@xiaoye/utils";
import type { SelectOption } from "@xiaoye/utils";

export type { SelectProps, SelectOption };

export const XySelect = withInstall(Select, "xy-select");
export default XySelect;
