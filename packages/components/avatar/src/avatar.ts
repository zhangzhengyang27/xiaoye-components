import type { ComponentSize } from "@xiaoye/utils";

export type AvatarShape = "circle" | "square";
export type AvatarFit = "fill" | "contain" | "cover" | "none" | "scale-down";

export interface AvatarProps {
  size?: number | ComponentSize;
  shape?: AvatarShape;
  icon?: string;
  src?: string;
  alt?: string;
  srcSet?: string;
  fit?: AvatarFit;
}
