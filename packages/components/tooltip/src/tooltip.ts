import type { Placement, ReferenceElement, Strategy } from "@floating-ui/dom";
import type { Ref, StyleValue } from "vue";

export const tooltipEffects = ["dark", "light"] as const;
export const tooltipTriggers = ["hover", "click", "focus", "contextmenu", "manual"] as const;

export type TooltipEffect = (typeof tooltipEffects)[number];
export type TooltipTrigger = (typeof tooltipTriggers)[number];

export interface TooltipPopperOptions {
  strategy?: Strategy;
  zIndex?: number;
  arrowPadding?: number;
  shiftPadding?: number;
  flip?: boolean;
  fallbackPlacements?: Placement[];
}

export interface TooltipProps {
  modelValue?: boolean;
  content?: string;
  placement?: Placement;
  disabled?: boolean;
  openDelay?: number;
  closeDelay?: number;
  showAfter?: number;
  hideAfter?: number;
  enterable?: boolean;
  trigger?: TooltipTrigger | TooltipTrigger[];
  triggerKeys?: string[];
  offset?: number;
  showArrow?: boolean;
  maxWidth?: number | string;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  persistent?: boolean;
  popperClass?: string;
  popperStyle?: StyleValue;
  closeOnEsc?: boolean;
  closeOnOutside?: boolean;
  ariaLabel?: string;
  effect?: TooltipEffect;
  rawContent?: boolean;
  transition?: string;
  virtualRef?: ReferenceElement | null;
  virtualTriggering?: boolean;
  popperOptions?: TooltipPopperOptions;
}

export interface TooltipExposed {
  triggerRef: Ref<HTMLElement | null>;
  contentRef: Ref<HTMLElement | null>;
  show: () => void;
  hide: () => void;
  updatePopper: () => Promise<void>;
  isFocusInsideContent: (event?: FocusEvent) => boolean;
}

export const DEFAULT_TOOLTIP_TRIGGER_KEYS = ["Enter", "NumpadEnter", "Space", " "];
