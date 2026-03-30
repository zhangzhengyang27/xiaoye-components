import Select from "./src/select.vue";
import type { SelectOption } from "@xiaoye/utils";
import type { SelectOptionGroup, SelectOptionItem, SelectProps, SelectValue } from "./src/select";
import { withInstall } from "@xiaoye/utils";

export type { SelectOption, SelectOptionGroup, SelectOptionItem, SelectProps, SelectValue };

export const XySelect = withInstall(Select, "xy-select");
export default XySelect;
