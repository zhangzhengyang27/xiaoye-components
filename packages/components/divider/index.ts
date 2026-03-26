import Divider from "./src/divider.vue";
import type {
  DividerBorderStyle,
  DividerContentPosition,
  DividerDirection,
  DividerProps
} from "./src/divider";
import { withInstall } from "@xiaoye/utils";

export type { DividerBorderStyle, DividerContentPosition, DividerDirection, DividerProps };

export const XyDivider = withInstall(Divider, "xy-divider");
export default XyDivider;
