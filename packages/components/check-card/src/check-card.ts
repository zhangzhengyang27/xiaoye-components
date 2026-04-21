import type { ComponentSize } from "@xiaoye/primitives";
import type { AvatarFit, AvatarShape } from "../../avatar";
import type { TagProps } from "../../tag";

export interface CheckCardAvatar {
  text?: string;
  icon?: string;
  src?: string;
  alt?: string;
  srcSet?: string;
  fit?: AvatarFit;
  shape?: AvatarShape;
  size?: number | ComponentSize;
}

export interface CheckCardTag {
  text: string;
  props?: TagProps;
}

export interface CheckCardProps {
  modelValue?: boolean;
  size?: ComponentSize;
  disabled?: boolean;
  title?: string;
  description?: string;
  extra?: string;
  avatar?: CheckCardAvatar;
  tag?: string | CheckCardTag;
  ariaLabel?: string;
}

export interface CheckCardSlotProps {
  checked: boolean;
  disabled: boolean;
  title: string;
  description: string;
  extra: string;
  avatar?: CheckCardAvatar;
  tag?: string | CheckCardTag;
}

export type CheckCardChangeHandler = (checked: boolean) => void;
export type CheckCardExtraHandler = () => void;
