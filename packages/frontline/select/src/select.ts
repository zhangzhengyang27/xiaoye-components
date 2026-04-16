import type { SelectOptionItem } from "@xiaoye/components/select/src/select";

export const frontSelectVariants = ["default", "soft"] as const;
export const frontSelectSizes = ["sm", "md", "lg"] as const;

export type FrontSelectVariant = (typeof frontSelectVariants)[number];
export type FrontSelectSize = (typeof frontSelectSizes)[number];
export type FrontSelectValue = string | number | Array<string | number> | null;

export interface FrontSelectProps {
  modelValue?: FrontSelectValue;
  options: SelectOptionItem[];
  placeholder?: string;
  size?: FrontSelectSize;
  variant?: FrontSelectVariant;
  clearable?: boolean;
  searchable?: boolean;
  leadingIcon?: string;
  trailingIcon?: string;
  /** @deprecated 请改用 leadingIcon。 */
  prefixIcon?: string;
  /** @deprecated 请改用 trailingIcon。 */
  suffixIcon?: string;
}
