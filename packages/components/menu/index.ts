import Menu from "./src/menu.vue";
import MenuItem from "./src/menu-item.vue";
import MenuItemGroup from "./src/menu-item-group.vue";
import SubMenu from "./src/sub-menu.vue";
import type { SFCWithInstall } from "@xiaoye/utils";
import { withInstall } from "@xiaoye/utils";
import type {
  MenuCloseEvent,
  MenuDataItem,
  MenuDataItemType,
  MenuExposes,
  MenuIcon,
  MenuMode,
  MenuOpenEvent,
  MenuPopperEffect,
  MenuPermissionChecker,
  MenuProps,
  MenuSelectEvent,
  MenuTrigger
} from "./src/menu";
import type { MenuInstance } from "./src/instance";
import type { MenuItemProps } from "./src/menu-item";
import type { MenuItemGroupProps } from "./src/menu-item-group";
import type { MenuItemClicked, MenuItemRegistered } from "./src/types";
import type { SubMenuProps } from "./src/sub-menu";

export type {
  MenuCloseEvent,
  MenuDataItem,
  MenuDataItemType,
  MenuExposes,
  MenuIcon,
  MenuInstance,
  MenuItemClicked,
  MenuItemGroupProps,
  MenuItemProps,
  MenuItemRegistered,
  MenuMode,
  MenuOpenEvent,
  MenuPopperEffect,
  MenuPermissionChecker,
  MenuProps,
  MenuSelectEvent,
  MenuTrigger,
  SubMenuProps
};

export const XyMenuItem = withInstall(MenuItem, "xy-menu-item");
export const XyMenuItemGroup = withInstall(MenuItemGroup, "xy-menu-item-group");
export const XySubMenu = withInstall(SubMenu, "xy-sub-menu");

export const XyMenu = withInstall(Menu, "xy-menu") as SFCWithInstall<typeof Menu> & {
  Item: typeof XyMenuItem;
  ItemGroup: typeof XyMenuItemGroup;
  SubMenu: typeof XySubMenu;
};

XyMenu.Item = XyMenuItem;
XyMenu.ItemGroup = XyMenuItemGroup;
XyMenu.SubMenu = XySubMenu;

export default XyMenu;
