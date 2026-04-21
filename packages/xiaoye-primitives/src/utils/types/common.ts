export type ComponentSize = "sm" | "md" | "lg";
export type ComponentStatus = "neutral" | "primary" | "success" | "warning" | "danger";

export interface SelectOption<T = string | number> {
  label: string;
  value: T;
  disabled?: boolean;
  description?: string;
}
