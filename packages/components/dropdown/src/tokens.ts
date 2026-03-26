import type { ComputedRef, InjectionKey, Ref } from "vue";
import type { DropdownRole, DropdownSelectItem } from "./dropdown";

export interface DropdownRegisteredItem {
  uid: number;
  isDisabled: () => boolean;
  getTextValue: () => string | undefined;
  getEl: () => HTMLElement | null;
  select: (event?: MouseEvent | KeyboardEvent) => void;
}

export interface DropdownContext {
  role: ComputedRef<DropdownRole>;
  itemRole: ComputedRef<"menuitem" | "link">;
  triggerId: ComputedRef<string>;
  hideOnClick: ComputedRef<boolean>;
  isUsingKeyboard: Ref<boolean>;
  loop: ComputedRef<boolean>;
  menuRef: Ref<HTMLElement | null>;
  registerItem: (item: DropdownRegisteredItem) => void;
  unregisterItem: (uid: number) => void;
  getItemIndex: (uid: number) => number;
  getItemTabIndex: (uid: number) => number;
  isItemActive: (uid: number) => boolean;
  setActiveByUid: (uid: number) => void;
  focusActiveItem: () => void;
  handleMenuKeydown: (event: KeyboardEvent) => Promise<void> | void;
  handleItemPointerMove: (uid: number) => void;
  handleItemPointerLeave: () => void;
  commandHandler: (command: string | number | Record<string, unknown> | undefined, item: DropdownSelectItem) => void;
  handleClose: (options?: { restoreFocus?: boolean; immediate?: boolean }) => void;
}

export const dropdownContextKey: InjectionKey<DropdownContext> = Symbol("xy-dropdown");
