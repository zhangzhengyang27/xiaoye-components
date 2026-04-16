export const frontCardSurfaces = ["default", "glass", "highlight"] as const;
export type FrontCardSurface = (typeof frontCardSurfaces)[number];

export interface FrontCardProps {
  title?: string;
  description?: string;
  eyebrow?: string;
  surface?: FrontCardSurface;
  interactive?: boolean;
}
