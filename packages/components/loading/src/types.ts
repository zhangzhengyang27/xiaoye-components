import type { VNode } from "vue";

export type LoadingText = string | VNode | VNode[];
export const DEFAULT_LOADING_SVG_VIEW_BOX = "0 0 50 50";

export type LoadingParentElement = HTMLElement;

export interface LoadingGlobalConfig {
  text?: string;
  background?: string;
  spinner?: string;
  svg?: string;
  svgViewBox?: string;
  delay?: number;
  minDuration?: number;
  fullscreen?: boolean;
  lock?: boolean;
}

export interface LoadingOptionsResolved {
  parent: LoadingParentElement;
  background: string;
  svg: string;
  svgViewBox: string;
  spinner: string;
  text: LoadingText;
  fullscreen: boolean;
  lock: boolean;
  customClass: string;
  visible: boolean;
  target: HTMLElement;
  delay: number;
  minDuration: number;
  groupKey?: string;
  beforeClose?: () => boolean;
  closed?: () => void;
}

export type LoadingOptions = Partial<
  Omit<LoadingOptionsResolved, "parent" | "target"> & {
    target: HTMLElement | string;
    body: boolean;
  }
>;

export type LoadingUpdatableOptions = Partial<
  Pick<
    LoadingOptionsResolved,
    | "background"
    | "svg"
    | "svgViewBox"
    | "spinner"
    | "text"
    | "customClass"
    | "visible"
    | "delay"
    | "minDuration"
  >
> &
  Pick<LoadingOptions, "beforeClose" | "closed">;
