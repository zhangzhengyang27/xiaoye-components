import Skeleton from "./src/skeleton.vue";
import SkeletonItem from "./src/skeleton-item.vue";
import type { SFCWithInstall } from "@xiaoye/utils";
import { withInstall } from "@xiaoye/utils";
import type {
  SkeletonProps,
  SkeletonThrottle,
  SkeletonThrottleOptions
} from "./src/skeleton";
import type {
  SkeletonItemProps,
  SkeletonItemVariant
} from "./src/skeleton-item";

export type {
  SkeletonItemProps,
  SkeletonItemVariant,
  SkeletonProps,
  SkeletonThrottle,
  SkeletonThrottleOptions
};

export const XySkeletonItem = withInstall(SkeletonItem, "xy-skeleton-item");

export const XySkeleton = withInstall(Skeleton, "xy-skeleton") as SFCWithInstall<
  typeof Skeleton
> & {
  Item: typeof XySkeletonItem;
};

XySkeleton.Item = XySkeletonItem;

export default XySkeleton;
