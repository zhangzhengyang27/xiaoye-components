export const skeletonItemVariants = [
  "circle",
  "rect",
  "h1",
  "h3",
  "text",
  "caption",
  "p",
  "image",
  "button"
] as const;

export type SkeletonItemVariant = (typeof skeletonItemVariants)[number];

export interface SkeletonItemProps {
  variant?: SkeletonItemVariant;
}
