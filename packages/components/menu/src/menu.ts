import type { Component, CSSProperties, PropType, StyleValue } from "vue";
import type { NavigationFailure, RouteLocationRaw } from "vue-router";
import type { MenuItemClicked } from "./types";

export type MenuMode = "horizontal" | "vertical";
export type MenuTrigger = "hover" | "click";
export type MenuPopperEffect = "dark" | "light" | string;
export type MenuIcon = string | Component;
export type MenuDataItemType = "item" | "submenu" | "group";
export interface MenuDataItem {
  index: string;
  label: string;
  type?: MenuDataItemType;
  children?: MenuDataItem[];
  disabled?: boolean;
  route?: RouteLocationRaw;
  icon?: MenuIcon;
  badge?: string | number;
  extraText?: string;
  hidden?: boolean;
  permission?: string | string[];
}
export type MenuPermissionChecker = (
  permission: string | string[] | undefined,
  item: MenuDataItem
) => boolean;
export type MenuSelectEvent = (
  index: string,
  indexPath: string[],
  item: MenuItemClicked,
  routerResult?: Promise<void | NavigationFailure>
) => void;
export type MenuOpenEvent = (index: string, indexPath: string[]) => void;
export type MenuCloseEvent = (index: string, indexPath: string[]) => void;

export interface MenuProps {
  mode?: MenuMode;
  defaultActive?: string;
  defaultOpeneds?: string[];
  activeIndex?: string;
  openedMenus?: string[];
  uniqueOpened?: boolean;
  router?: boolean;
  menuTrigger?: MenuTrigger;
  collapse?: boolean;
  items?: MenuDataItem[];
  permissionChecker?: MenuPermissionChecker;
  backgroundColor?: string;
  textColor?: string;
  activeTextColor?: string;
  closeOnClickOutside?: boolean;
  collapseTransition?: boolean;
  ellipsis?: boolean;
  popperOffset?: number;
  ellipsisIcon?: MenuIcon;
  popperEffect?: MenuPopperEffect;
  popperClass?: string;
  popperStyle?: StyleValue;
  showTimeout?: number;
  hideTimeout?: number;
  persistent?: boolean;
}

export interface MenuExposes {
  open: (index: string) => void;
  close: (index: string) => void;
  handleResize: () => void;
  updateActiveIndex: (index: string) => void;
}

export const MENU_MORE_INDEX = "__xy_menu_more__";
export const DEFAULT_MENU_MORE_WIDTH = 64;

export const menuProps = {
  mode: {
    type: String,
    default: "vertical"
  },
  defaultActive: {
    type: String,
    default: ""
  },
  defaultOpeneds: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  activeIndex: {
    type: String,
    default: undefined
  },
  openedMenus: {
    type: Array as PropType<string[]>,
    default: undefined
  },
  uniqueOpened: {
    type: Boolean,
    default: false
  },
  router: {
    type: Boolean,
    default: false
  },
  menuTrigger: {
    type: String,
    default: "hover"
  },
  collapse: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array as PropType<MenuDataItem[]>,
    default: undefined
  },
  permissionChecker: {
    type: Function as PropType<MenuPermissionChecker>,
    default: undefined
  },
  backgroundColor: {
    type: String,
    default: ""
  },
  textColor: {
    type: String,
    default: ""
  },
  activeTextColor: {
    type: String,
    default: ""
  },
  closeOnClickOutside: {
    type: Boolean,
    default: false
  },
  collapseTransition: {
    type: Boolean,
    default: true
  },
  ellipsis: {
    type: Boolean,
    default: true
  },
  popperOffset: {
    type: Number,
    default: 6
  },
  ellipsisIcon: {
    type: [String, Object, Function],
    default: "mdi:dots-horizontal"
  },
  popperEffect: {
    type: String,
    default: "dark"
  },
  popperClass: {
    type: String,
    default: ""
  },
  popperStyle: {
    type: [String, Object, Array],
    default: undefined
  },
  showTimeout: {
    type: Number,
    default: 300
  },
  hideTimeout: {
    type: Number,
    default: 300
  },
  persistent: {
    type: Boolean,
    default: true
  }
} as const;

export const menuEmits = {
  "update:activeIndex": (_value: string) => true,
  "update:openedMenus": (_value: string[]) => true,
  select: (
    _index: string,
    _indexPath: string[],
    _item: MenuItemClicked,
    _routerResult?: Promise<void | NavigationFailure>
  ) => true,
  open: (_index: string, _indexPath: string[]) => true,
  close: (_index: string, _indexPath: string[]) => true
} as const;

export function resolveMenuCssVars(props: Readonly<MenuProps>): CSSProperties {
  return {
    "--xy-menu-bg-color": props.backgroundColor || undefined,
    "--xy-menu-text-color": props.textColor || undefined,
    "--xy-menu-active-color": props.activeTextColor || undefined
  } as CSSProperties;
}
