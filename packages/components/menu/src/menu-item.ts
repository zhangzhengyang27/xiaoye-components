import type { RouteLocationRaw } from "vue-router";
import type { MenuItemRegistered } from "./types";

export interface MenuItemProps {
  index: string;
  route?: RouteLocationRaw;
  disabled?: boolean;
}

export const menuItemProps = {
  index: {
    type: String,
    required: true
  },
  route: {
    type: [String, Object],
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  }
} as const;

export const menuItemEmits = {
  click: (_item: MenuItemRegistered) => true
} as const;
