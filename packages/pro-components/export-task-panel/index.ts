import ExportTaskPanel from "./src/export-task-panel.vue";
import type {
  ExportTaskItem,
  ExportTaskPanelProps
} from "./src/export-task-panel";
import { withInstall } from "@xiaoye/utils";

export type { ExportTaskItem, ExportTaskPanelProps };

export const XyExportTaskPanel = withInstall(ExportTaskPanel, "xy-export-task-panel");

export default XyExportTaskPanel;
