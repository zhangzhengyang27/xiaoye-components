import { withInstall } from "xiaoye-primitives";
import Dropdown from "./dropdown.vue";
import type { DropdownProps, DropdownInstance, DropdownMenuItem, DropdownTrigger } from "./dropdown";

export type { DropdownProps, DropdownInstance, DropdownMenuItem, DropdownTrigger };

export const XyuDropdown = withInstall(Dropdown, "XyuDropdown");

export default XyuDropdown;
