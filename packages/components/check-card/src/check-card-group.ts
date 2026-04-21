import type { ComponentSize } from "@xiaoye/primitives";
import type { CheckCardProps } from "./check-card";

export type CheckCardValue = string | number;
export type CheckCardSingleValue = CheckCardValue | null;

export interface CheckCardGroupOption
  extends Omit<CheckCardProps, "modelValue" | "size" | "disabled" | "ariaLabel"> {
  value: CheckCardValue;
  size?: ComponentSize;
  disabled?: boolean;
}

export interface CheckCardGroupProps {
  modelValue?: CheckCardSingleValue | CheckCardValue[];
  options?: CheckCardGroupOption[];
  size?: ComponentSize;
  disabled?: boolean;
  multiple?: boolean;
  ariaLabel?: string;
}

export interface CheckCardGroupSlotProps {
  option: CheckCardGroupOption;
  checked: boolean;
  disabled: boolean;
}

export type CheckCardGroupChangeHandler = (
  value: CheckCardSingleValue | CheckCardValue[]
) => void;
export type CheckCardGroupExtraHandler = (option: CheckCardGroupOption) => void;
