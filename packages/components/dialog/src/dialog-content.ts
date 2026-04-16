import type { Component, StyleValue } from "vue";

export interface DialogContentProps {
  title?: string;
  titleId: string;
  bodyId: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaLevel?: string;
  center?: boolean;
  alignCenter?: boolean;
  closeIcon?: string | Component;
  draggable?: boolean;
  overflow?: boolean;
  fullscreen?: boolean;
  maximizable?: boolean;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  bodyMaxHeight?: string | number;
  loading?: boolean;
  loadingText?: string;
  panelClass?: string;
  loadingSpinner?: string;
  loadingSvg?: string;
  loadingSvgViewBox?: string;
  loadingBackground?: string;
  resizable?: boolean;
  isResizing?: boolean;
  headerClass?: string;
  bodyClass?: string;
  footerClass?: string;
  showClose?: boolean;
  style?: StyleValue;
  modal?: boolean;
  handleFocusTrapKeydown?: (event: KeyboardEvent) => void;
  handleResizeStart?: (event: MouseEvent) => void;
}

export const dialogContentPropsDefaults = {
  title: "",
  ariaLabel: undefined,
  ariaLabelledby: undefined,
  ariaLevel: "2",
  center: false,
  alignCenter: false,
  closeIcon: "mdi:close",
  draggable: false,
  overflow: false,
  fullscreen: false,
  maximizable: false,
  stickyHeader: false,
  stickyFooter: false,
  bodyMaxHeight: undefined,
  loading: false,
  loadingText: "",
  panelClass: "",
  loadingSpinner: "",
  loadingSvg: "",
  loadingSvgViewBox: "0 0 50 50",
  loadingBackground: "",
  resizable: false,
  isResizing: false,
  headerClass: "",
  bodyClass: "",
  footerClass: "",
  showClose: true,
  style: undefined,
  modal: true,
  handleFocusTrapKeydown: undefined,
  handleResizeStart: undefined
} as const satisfies Partial<DialogContentProps>;

export interface DialogContentInstance {
  dialogRef: HTMLElement | null;
  headerRef: HTMLElement | null;
  resetPosition: () => void;
  updatePosition: () => void;
}
