import type { TransitionProps } from "vue";
import type Drawer from "./drawer.vue";

export const drawerPlacements = ["left", "right", "top", "bottom"] as const;
export const drawerDirections = ["ltr", "rtl", "ttb", "btt"] as const;

export type DrawerPlacement = (typeof drawerPlacements)[number];
export type DrawerDirection = (typeof drawerDirections)[number];
export type DrawerTransition = string | TransitionProps;
export type DrawerCloseReason = "close" | "backdrop" | "escape" | "programmatic";

export interface DrawerProps {
  modelValue?: boolean;
  title?: string;
  size?: string | number;
  placement?: DrawerPlacement;
  direction?: DrawerDirection;
  closeOnOverlay?: boolean;
  closeOnClickModal?: boolean;
  closeOnEsc?: boolean;
  closeOnPressEscape?: boolean;
  destroyOnClose?: boolean;
  showClose?: boolean;
  lockScroll?: boolean;
  withHeader?: boolean;
  beforeClose?: (
    done: (cancel?: boolean) => void,
    reason?: DrawerCloseReason
  ) => void | Promise<void>;
  appendToBody?: boolean;
  appendTo?: string | HTMLElement;
  modal?: boolean;
  modalClass?: string;
  modalPenetrable?: boolean;
  openDelay?: number;
  closeDelay?: number;
  resizable?: boolean;
  customClass?: string;
  headerClass?: string;
  bodyClass?: string;
  footerClass?: string;
  zIndex?: number;
  headerAriaLevel?: string | number;
  modalFade?: boolean;
  closeIcon?: string;
  fullscreen?: boolean;
  transition?: DrawerTransition;
}

export type DrawerInstance = InstanceType<typeof Drawer> & {
  handleClose: (reason?: DrawerCloseReason) => void;
  afterEnter: () => void;
  afterLeave: () => void;
};
