import type Skeleton from "./skeleton.vue";

export interface SkeletonThrottleOptions {
  leading?: number;
  trailing?: number;
  initVal?: boolean;
}

export type SkeletonThrottle = number | SkeletonThrottleOptions;

export interface SkeletonProps {
  animated?: boolean;
  count?: number;
  rows?: number;
  loading?: boolean;
  throttle?: SkeletonThrottle;
}

export type SkeletonInstance = InstanceType<typeof Skeleton>;
