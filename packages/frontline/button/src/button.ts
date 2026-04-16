import type { Component } from "vue";

export const frontButtonVariants = ["solid", "soft", "outline", "ghost"] as const;
export const frontButtonTones = ["neutral", "brand", "success", "warning", "danger"] as const;
export const frontButtonSizes = ["sm", "md", "lg"] as const;

export type FrontButtonVariant = (typeof frontButtonVariants)[number];
export type FrontButtonTone = (typeof frontButtonTones)[number];
export type FrontButtonSize = (typeof frontButtonSizes)[number];

export interface FrontButtonProps {
  variant?: FrontButtonVariant;
  tone?: FrontButtonTone;
  size?: FrontButtonSize;
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  leadingIcon?: string;
  trailingIcon?: string;
  asChild?: boolean;
  tag?: string | Component;
  nativeType?: "button" | "submit" | "reset";
}
