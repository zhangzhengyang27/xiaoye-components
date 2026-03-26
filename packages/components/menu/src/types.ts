import type { ComputedRef, Ref } from "vue";
import type { RouteLocationRaw } from "vue-router";
import type { MenuProps } from "./menu";

export interface MenuItemRegistered {
  index: string;
  indexPath: string[];
  active: boolean;
}

export interface MenuItemClicked {
  index: string;
  indexPath: string[];
  route?: RouteLocationRaw;
}

export interface InternalMenuNode {
  index: string;
  indexPath: ComputedRef<string[]>;
  active: ComputedRef<boolean>;
  disabled?: boolean;
}

export interface MenuProvider {
  openedMenus: Readonly<Ref<string[]>>;
  items: Ref<Record<string, InternalMenuNode>>;
  subMenus: Ref<Record<string, InternalMenuNode>>;
  activeIndex: Readonly<Ref<string>>;
  isMenuPopup: ComputedRef<boolean>;
  props: Readonly<MenuProps>;
  addMenuItem: (item: InternalMenuNode) => void;
  removeMenuItem: (index: string) => void;
  addSubMenu: (item: InternalMenuNode) => void;
  removeSubMenu: (index: string) => void;
  openMenu: (index: string, indexPath: string[]) => void;
  closeMenu: (index: string, indexPath: string[]) => void;
  handleMenuItemClick: (item: MenuItemClicked) => void;
  handleSubMenuClick: (subMenu: MenuItemClicked) => void;
  registerPopupElement: (element: HTMLElement) => void;
  unregisterPopupElement: (element: HTMLElement) => void;
  closeAllMenus: () => void;
}

export interface SubMenuProvider {
  indexPath: ComputedRef<string[]>;
  level: number;
  addMenuItem: (item: InternalMenuNode) => void;
  removeMenuItem: (index: string) => void;
  addSubMenu: (item: InternalMenuNode) => void;
  removeSubMenu: (index: string) => void;
  keepAlive: () => void;
}
