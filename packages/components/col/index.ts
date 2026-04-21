import Col from "./src/col.vue";
import type { ColBreakpoint, ColProps, ColSize, ColSizeObject } from "./src/col";
import { withInstall } from "@xiaoye/primitives";

export type { ColBreakpoint, ColProps, ColSize, ColSizeObject };

export const XyCol = withInstall(Col, "xy-col");
export default XyCol;
