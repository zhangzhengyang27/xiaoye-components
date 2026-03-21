import Dropdown from "./src/dropdown.vue";
import type { DropdownProps, DropdownItem } from "./src/dropdown.vue";
import { withInstall } from "@xiaoye/utils";

export type { DropdownProps, DropdownItem };

export const XyDropdown = withInstall(Dropdown, "xy-dropdown");
export default XyDropdown;

