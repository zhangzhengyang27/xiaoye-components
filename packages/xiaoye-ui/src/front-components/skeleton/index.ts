import { withInstall } from "xiaoye-primitives";
import Skeleton from "./skeleton.vue";
import type { SkeletonProps, SkeletonInstance } from "./skeleton";

export type { SkeletonProps, SkeletonInstance };

export const XyuSkeleton = withInstall(Skeleton, "XyuSkeleton");

export default XyuSkeleton;
