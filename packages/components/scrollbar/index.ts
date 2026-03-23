import Scrollbar from "./src/scrollbar.vue";
import type { ScrollbarDirection, ScrollbarProps } from "./src/scrollbar";
import { withInstall } from "@xiaoye/utils";

export type { ScrollbarDirection, ScrollbarProps };

export const XyScrollbar = withInstall(Scrollbar, "xy-scrollbar");
export default XyScrollbar;
