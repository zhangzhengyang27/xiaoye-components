export type InputTagSize = "sm" | "md" | "lg";
export type InputTagType = "text" | "number";

export interface InputTagProps {
  modelValue?: string[];
  size?: InputTagSize;
  type?: InputTagType;
  placeholder?: string;
  max?: number;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  maxlength?: number;
  tagType?: "primary" | "success" | "warning" | "danger" | "info";
  allowDuplicate?: boolean;
  split?: string;
}

export type InputTagInstance = InstanceType<import("./input-tag.vue").default>;
