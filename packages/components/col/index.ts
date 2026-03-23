import Col from "./src/col.vue";
import type { ColBreakpoint, ColProps, ColSize, ColSizeObject } from "./src/col";
import { withInstall } from "@xiaoye/utils";

export type { ColBreakpoint, ColProps, ColSize, ColSizeObject };

export const XyCol = withInstall(Col, "xy-col");
export default XyCol;
