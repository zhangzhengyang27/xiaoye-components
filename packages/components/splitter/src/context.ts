import type { InjectionKey, Ref } from "vue";
import type {
  SplitterCollapseDirection,
  SplitterLayout,
  SplitterSize
} from "./splitter";

export interface SplitterPanelRegistration {
  uid: number;
  size?: SplitterSize;
  min?: SplitterSize;
  max?: SplitterSize;
  resizable: boolean;
  collapsible: boolean;
  emitSizeUpdate: (value: number) => void;
  setIndex: (value: number) => void;
}

export interface SplitterRootContext {
  layout: Ref<SplitterLayout>;
  lazy: Ref<boolean>;
  panels: Ref<SplitterPanelRegistration[]>;
  movingIndex: Ref<number | null>;
  previewOffset: Ref<number>;
  registerPanel: (panel: SplitterPanelRegistration) => void;
  unregisterPanel: (uid: number) => void;
  getPanel: (index: number) => SplitterPanelRegistration | undefined;
  getPanelSize: (index: number) => number;
  onResizeStart: (index: number) => void;
  onResize: (index: number, offset: number) => void;
  onResizeEnd: (index: number) => void;
  onCollapse: (index: number, direction: SplitterCollapseDirection) => void;
}

export const splitterContextKey: InjectionKey<SplitterRootContext> = Symbol(
  "splitterContextKey"
);
