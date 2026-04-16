import type { InputType } from "@xiaoye/components/input/src/input";

export const frontInputVariants = ["default", "soft", "underline"] as const;
export const frontInputSizes = ["sm", "md", "lg"] as const;
export type FrontInputVariant = (typeof frontInputVariants)[number];
export type FrontInputSize = (typeof frontInputSizes)[number];

export interface FrontInputProps {
  modelValue?: string | number | null;
  type?: InputType;
  placeholder?: string;
  size?: FrontInputSize;
  clearable?: boolean;
  variant?: FrontInputVariant;
  leadingIcon?: string;
  trailingIcon?: string;
  /** @deprecated 请改用 leadingIcon。 */
  prefixIcon?: string;
  /** @deprecated 请改用 trailingIcon。 */
  suffixIcon?: string;
}
