import Scrollbar from "./src/scrollbar.vue";
import type {
  ScrollbarDirection,
  ScrollbarInstance,
  ScrollbarProps,
  ScrollbarScrollPayload
} from "./src/scrollbar";
import { withInstall } from "@xiaoye/primitives";

export type { ScrollbarDirection, ScrollbarInstance, ScrollbarProps, ScrollbarScrollPayload };

export const XyScrollbar = withInstall(Scrollbar, "xy-scrollbar");
export default XyScrollbar;
