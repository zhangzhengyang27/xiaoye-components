export type TagType = "default" | "primary" | "success" | "warning" | "danger" | "info";
export type TagSize = "sm" | "md" | "lg";

export interface TagProps {
  type?: TagType;
  size?: TagSize;
  round?: boolean;
  closable?: boolean;
  closableIcon?: boolean;
}

export type TagInstance = InstanceType<import("./tag.vue").default>;
