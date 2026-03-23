import Select from "./src/select.vue";
import type { SelectOption } from "@xiaoye/utils";
import type { SelectOptionGroup, SelectOptionItem, SelectProps } from "./src/select";
import { withInstall } from "@xiaoye/utils";

export type { SelectOption, SelectOptionGroup, SelectOptionItem, SelectProps };

export const XySelect = withInstall(Select, "xy-select");
export default XySelect;
