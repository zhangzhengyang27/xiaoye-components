import type { Component, PropType, TransitionProps } from "vue";

export type DialogCloseReason = "close" | "backdrop" | "escape" | "programmatic";
export type DialogDoneFn = (cancel?: boolean) => void;
export type DialogBeforeCloseFn = (
  done: DialogDoneFn,
  reason?: DialogCloseReason
) => void | Promise<void>;
export type DialogTransition = string | TransitionProps;

export interface DialogGlobalConfig {
  alignCenter?: boolean;
  draggable?: boolean;
  overflow?: boolean;
  lockScroll?: boolean;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  transition?: DialogTransition;
  resizable?: boolean;
  maximizable?: boolean;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
}

export interface DialogProps {
  modelValue?: boolean;
  title?: string;
  appendToBody?: boolean;
  appendTo?: string | HTMLElement;
  beforeClose?: DialogBeforeCloseFn;
  destroyOnClose?: boolean;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  lockScroll?: boolean;
  modal?: boolean;
  modalPenetrable?: boolean;
  openDelay?: number;
  closeDelay?: number;
  top?: string;
  modalClass?: string;
  panelClass?: string;
  width?: string | number;
  zIndex?: number;
  center?: boolean;
  alignCenter?: boolean;
  closeIcon?: string | Component;
  draggable?: boolean;
  overflow?: boolean;
  fullscreen?: boolean;
  resizable?: boolean;
  minWidth?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  maximizable?: boolean;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  bodyMaxHeight?: string | number;
  loading?: boolean;
  loadingText?: string;
  headerClass?: string;
  bodyClass?: string;
  footerClass?: string;
  showClose?: boolean;
  headerAriaLevel?: string;
  transition?: DialogTransition;
}

export const dialogProps = {
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ""
  },
  appendToBody: {
    type: Boolean,
    default: false
  },
  appendTo: {
    type: [String, Object] as PropType<string | HTMLElement>,
    default: "body"
  },
  beforeClose: {
    type: Function as PropType<DialogBeforeCloseFn>,
    default: undefined
  },
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  closeOnClickModal: {
    type: Boolean,
    default: undefined
  },
  closeOnPressEscape: {
    type: Boolean,
    default: undefined
  },
  lockScroll: {
    type: Boolean,
    default: undefined
  },
  modal: {
    type: Boolean,
    default: true
  },
  modalPenetrable: {
    type: Boolean,
    default: false
  },
  openDelay: {
    type: Number,
    default: 0
  },
  closeDelay: {
    type: Number,
    default: 0
  },
  top: {
    type: String,
    default: "15vh"
  },
  modalClass: {
    type: String,
    default: ""
  },
  panelClass: {
    type: String,
    default: ""
  },
  width: {
    type: [String, Number] as PropType<string | number | undefined>,
    default: undefined
  },
  zIndex: {
    type: Number,
    default: undefined
  },
  center: {
    type: Boolean,
    default: false
  },
  alignCenter: {
    type: Boolean,
    default: undefined
  },
  closeIcon: {
    type: [String, Object] as PropType<string | Component>,
    default: "mdi:close"
  },
  draggable: {
    type: Boolean,
    default: undefined
  },
  overflow: {
    type: Boolean,
    default: undefined
  },
  fullscreen: {
    type: Boolean,
    default: undefined
  },
  resizable: {
    type: Boolean,
    default: undefined
  },
  minWidth: {
    type: [String, Number] as PropType<string | number | undefined>,
    default: undefined
  },
  maxWidth: {
    type: [String, Number] as PropType<string | number | undefined>,
    default: undefined
  },
  minHeight: {
    type: [String, Number] as PropType<string | number | undefined>,
    default: undefined
  },
  maxHeight: {
    type: [String, Number] as PropType<string | number | undefined>,
    default: undefined
  },
  maximizable: {
    type: Boolean,
    default: undefined
  },
  stickyHeader: {
    type: Boolean,
    default: undefined
  },
  stickyFooter: {
    type: Boolean,
    default: undefined
  },
  bodyMaxHeight: {
    type: [String, Number] as PropType<string | number | undefined>,
    default: undefined
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: ""
  },
  headerClass: {
    type: String,
    default: ""
  },
  bodyClass: {
    type: String,
    default: ""
  },
  footerClass: {
    type: String,
    default: ""
  },
  showClose: {
    type: Boolean,
    default: true
  },
  headerAriaLevel: {
    type: String,
    default: "2"
  },
  transition: {
    type: [String, Object] as PropType<DialogTransition>,
    default: undefined
  }
} satisfies Record<string, unknown>;
