import type { Component, StyleValue } from "vue";

export type MenuIcon = string | Component;

export interface SubMenuProps {
  index: string;
  popperClass?: string;
  popperStyle?: StyleValue;
  showTimeout?: number;
  hideTimeout?: number;
  disabled?: boolean;
  teleported?: boolean;
  popperOffset?: number;
  expandCloseIcon?: MenuIcon;
  expandOpenIcon?: MenuIcon;
  collapseCloseIcon?: MenuIcon;
  collapseOpenIcon?: MenuIcon;
}

export const subMenuProps = {
  index: {
    type: String,
    required: true
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
    default: undefined
  },
  hideTimeout: {
    type: Number,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  },
  teleported: {
    type: Boolean,
    default: undefined
  },
  popperOffset: {
    type: Number,
    default: undefined
  },
  expandCloseIcon: {
    type: [String, Object, Function],
    default: undefined
  },
  expandOpenIcon: {
    type: [String, Object, Function],
    default: undefined
  },
  collapseCloseIcon: {
    type: [String, Object, Function],
    default: undefined
  },
  collapseOpenIcon: {
    type: [String, Object, Function],
    default: undefined
  }
} as const;
