import DetailPanel from "./src/detail-panel.vue";
import type {
  DetailPanelInstance,
  DetailPanelProps
} from "./src/detail-panel";
import { withInstall } from "@xiaoye/primitives";

export type { DetailPanelInstance, DetailPanelProps };

export const XyDetailPanel = withInstall(DetailPanel, "xy-detail-panel");

export default XyDetailPanel;
