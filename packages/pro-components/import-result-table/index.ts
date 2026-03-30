import ImportResultTable from "./src/import-result-table.vue";
import type {
  ImportResultSummary,
  ImportResultTableProps
} from "./src/import-result-table";
import { withInstall } from "@xiaoye/utils";

export type { ImportResultSummary, ImportResultTableProps };

export const XyImportResultTable = withInstall(
  ImportResultTable,
  "xy-import-result-table"
);

export default XyImportResultTable;
