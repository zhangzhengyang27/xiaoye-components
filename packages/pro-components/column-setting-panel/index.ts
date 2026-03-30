import ColumnSettingPanel from "./src/column-setting-panel.vue";
import type {
  ColumnSettingPanelColumn,
  ColumnSettingPanelProps
} from "./src/column-setting-panel";
import { withInstall } from "@xiaoye/utils";

export type { ColumnSettingPanelColumn, ColumnSettingPanelProps };

export const XyColumnSettingPanel = withInstall(
  ColumnSettingPanel,
  "xy-column-setting-panel"
);

export default XyColumnSettingPanel;
