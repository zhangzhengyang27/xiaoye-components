import Dropdown from "./src/dropdown.vue";
import DropdownMenu from "./src/dropdown-menu.vue";
import DropdownItemComponent from "./src/dropdown-item.vue";
import type { SFCWithInstall } from "@xiaoye/primitives";
import { withInstall } from "@xiaoye/primitives";
import type {
  DropdownClickHandler,
  DropdownCommand,
  DropdownCommandHandler,
  DropdownItem,
  DropdownModelValueChangeHandler,
  DropdownPopperOptions,
  DropdownProps,
  DropdownRole,
  DropdownSelectHandler,
  DropdownSelectItem,
  DropdownTrigger,
  DropdownVisibleChangeHandler
} from "./src/dropdown";
import type { DropdownItemProps } from "./src/dropdown-item";
import type { DropdownMenuProps } from "./src/dropdown-menu";

export type {
  DropdownClickHandler,
  DropdownCommand,
  DropdownCommandHandler,
  DropdownItem,
  DropdownItemProps,
  DropdownMenuProps,
  DropdownModelValueChangeHandler,
  DropdownPopperOptions,
  DropdownProps,
  DropdownRole,
  DropdownSelectHandler,
  DropdownSelectItem,
  DropdownTrigger,
  DropdownVisibleChangeHandler
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
