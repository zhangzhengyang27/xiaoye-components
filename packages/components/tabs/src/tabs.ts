import type { Ref } from "vue";

export interface TabItem {
  key: string;
  label: string;
  disabled?: boolean;
  closable?: boolean;
}

export interface TabsDefaultSlotProps {
  activeKey: string;
  activeItem?: TabItem;
}

export const tabsTypes = ["", "card", "border-card"] as const;
export const tabsPositions = ["top", "right", "bottom", "left"] as const;

export type TabsType = (typeof tabsTypes)[number];
export type TabsPosition = (typeof tabsPositions)[number];
export type TabsModelValueChangeHandler = (value: string) => void;
export type TabsChangeHandler = (value: string) => void;
export type TabsTabClickHandler = (key: string, event: MouseEvent | KeyboardEvent) => void;
export type TabsEditAction = "remove" | "add";
export type TabsEditHandler = (key: string | undefined, action: TabsEditAction) => void;
export type TabsTabRemoveHandler = (key: string) => void;
export type TabsTabAddHandler = () => void;
export type TabsBeforeLeave = (
  newKey: string,
  oldKey: string
) => boolean | void | Promise<boolean | void>;

export interface TabsProps {
  modelValue?: string;
  defaultValue?: string;
  items: TabItem[];
  type?: TabsType;
  tabPosition?: TabsPosition;
  closable?: boolean;
  addable?: boolean;
  editable?: boolean;
  stretch?: boolean;
  beforeLeave?: TabsBeforeLeave;
  tabindex?: string | number;
}

export interface TabsInstance {
  currentName: Ref<string>;
  scrollToActiveTab: () => Promise<void>;
}
