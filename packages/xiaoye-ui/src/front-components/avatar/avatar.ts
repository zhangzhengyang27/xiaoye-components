export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "square";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize | number;
  shape?: AvatarShape;
  fit?: "fill" | "contain" | "cover" | "none" | "scale-down";
  initials?: string;
}

export type AvatarInstance = InstanceType<import("./avatar.vue").default>;
