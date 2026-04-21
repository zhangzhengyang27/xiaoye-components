export type SkeletonSize = "sm" | "md" | "lg";

export interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  size?: SkeletonSize;
  loading?: boolean;
  animated?: boolean;
  rows?: number;
}

export type SkeletonInstance = InstanceType<import("./skeleton.vue").default>;
