import { withInstall } from "xiaoye-primitives";
import Progress from "./progress.vue";
import type { ProgressProps, ProgressInstance, ProgressType, ProgressStatus, ProgressSize } from "./progress";

export type { ProgressProps, ProgressInstance, ProgressType, ProgressStatus, ProgressSize };

export const XyuProgress = withInstall(Progress, "XyuProgress");

export default XyuProgress;
