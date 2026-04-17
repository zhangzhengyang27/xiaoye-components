import type InputTag from "./input-tag.vue";
import type { HTMLAttributes, StyleValue } from "vue";
import type { ComponentSize, ComponentStatus } from "@xiaoye/utils";

export type InputTagTrigger = "Enter" | "Space";
export type InputTagDropType = "before" | "after";
export type InputTagValue = string[] | undefined;
export type InputTagValueChangeHandler = (value: InputTagValue) => void;
export type InputTagInputHandler = (value: string) => void;
export type InputTagAddTagHandler = (value: string | string[]) => void;
export type InputTagRemoveTagHandler = (value: string, index: number) => void;
export type InputTagDragTagHandler = (
  oldIndex: number,
  newIndex: number,
  value: string
) => void;
export type InputTagFocusHandler = (event: FocusEvent) => void;

export interface InputTagSlotProps {
  value: string;
  index: number;
}

export interface InputTagProps {
  modelValue?: string[] | undefined;
  max?: number;
  trigger?: InputTagTrigger;
  draggable?: boolean;
  delimiter?: string | RegExp;
  size?: ComponentSize;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  clearIcon?: string;
  validateEvent?: boolean;
  autofocus?: boolean;
  id?: string;
  tabindex?: string | number;
  maxlength?: string | number;
  minlength?: string | number;
  placeholder?: string;
  autocomplete?: string;
  saveOnBlur?: boolean;
  ariaLabel?: string;
  name?: string;
  tagStatus?: ComponentStatus;
  tagRound?: boolean;
  inputmode?: HTMLAttributes["inputmode"];
  inputStyle?: StyleValue;
}

export type InputTagInstance = InstanceType<typeof InputTag>;

export const DEFAULT_CLEAR_ICON = "mdi:close-circle";
