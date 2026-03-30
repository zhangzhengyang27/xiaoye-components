import Dropdown from "./src/dropdown.vue";
import DropdownMenu from "./src/dropdown-menu.vue";
import DropdownItemComponent from "./src/dropdown-item.vue";
import type { SFCWithInstall } from "@xiaoye/utils";
import { withInstall } from "@xiaoye/utils";
import type {
  DropdownCommand,
  DropdownItem,
  DropdownPopperOptions,
  DropdownProps,
  DropdownRole,
  DropdownSelectItem,
  DropdownTrigger
} from "./src/dropdown";
import type { DropdownItemProps } from "./src/dropdown-item";
import type { DropdownMenuProps } from "./src/dropdown-menu";

export type {
  DropdownCommand,
  DropdownItem,
  DropdownItemProps,
  DropdownMenuProps,
  DropdownPopperOptions,
  DropdownProps,
  DropdownRole,
  DropdownSelectItem,
  DropdownTrigger
};

export const XyDropdownMenu = withInstall(DropdownMenu, "xy-dropdown-menu");
export const XyDropdownItem = withInstall(DropdownItemComponent, "xy-dropdown-item");

export const XyDropdown = withInstall(Dropdown, "xy-dropdown") as SFCWithInstall<
  typeof Dropdown
> & {
  Menu: typeof XyDropdownMenu;
  Item: typeof XyDropdownItem;
};

XyDropdown.Menu = XyDropdownMenu;
XyDropdown.Item = XyDropdownItem;

export default XyDropdown;
