import type { App, Plugin } from "vue";
import * as ProComponentExports from "./exports";
import { proInstallableComponentExportNames } from "./component-manifest";

export * from "./exports";
export type {
  SearchFormField,
  SearchFormInstance,
  SearchFormProps
} from "./search-form";
export type {
  ProFormInstance,
  ProFormProps
} from "./pro-form";
export type {
  OverlayFormInstance,
  OverlayFormProps,
  OverlayFormSubmitPayload
} from "./overlay-form";
export type {
  StepsFormInstance,
  StepsFormProps,
  StepsFormStep
} from "./steps-form";
export type { FilterPanelProps } from "./filter-panel";
export type {
  RequestFormProps,
  RequestFormSubmitContext
} from "./request-form";
export type {
  ProTableColumn,
  ProTableInstance,
  ProTableProps
} from "./pro-table";
export type {
  ColumnSettingPanelColumn,
  ColumnSettingPanelProps
} from "./column-setting-panel";
export type {
  SavedViewTabItem,
  SavedViewTabsProps
} from "./saved-view-tabs";
export type { TableFilterDrawerProps } from "./table-filter-drawer";
export type {
  ImportResultSummary,
  ImportResultTableProps
} from "./import-result-table";
export type {
  AuditTimelineAttachment,
  AuditTimelineEntry,
  AuditTimelineProps
} from "./audit-timeline";
export type {
  DetailPanelInstance,
  DetailPanelProps
} from "./detail-panel";
export type {
  DetailPageAction,
  DetailPageAttachmentFile,
  DetailPageBreadcrumbItem,
  DetailPageProps
} from "./detail-page";
export type { AsyncStateContainerProps } from "./async-state-container";
export type {
  ListPageActionRef,
  ListPageBatchAction,
  ListPageProps
} from "./list-page";
export type { CrudPageProps } from "./crud-page";
export type { SplitLayoutPageProps } from "./split-layout-page";
export type {
  ApprovalFlowNode,
  ApprovalFlowPanelProps
} from "./approval-flow-panel";
export type {
  ImportWizardProps,
  ImportWizardStep
} from "./import-wizard";
export type {
  ExportTaskItem,
  ExportTaskPanelProps
} from "./export-task-panel";
export type {
  ProActionRef,
  ProFieldSchema,
  ProFieldSchemaBuiltinComponent,
  ProFieldSchemaOption,
  ProPageAction,
  ProRequestActionRef,
  ProRequestContext,
  ProRequestData,
  ProRequestResult
} from "./core";

const INSTALL_KEY = Symbol.for("xiaoye-pro-components:installed");

function isInstallableExport(value: unknown): value is Plugin {
  return (
    (typeof value === "function" || typeof value === "object") &&
    value !== null &&
    "install" in value &&
    typeof (value as { install?: unknown }).install === "function"
  );
}

const installableExports = Array.from(
  new Set(
    proInstallableComponentExportNames
      .map((name) => ProComponentExports[name as keyof typeof ProComponentExports])
      .filter(isInstallableExport)
  )
) as Plugin[];

export function install(app: App) {
  const appWithInstallFlag = app as App & {
    [INSTALL_KEY]?: boolean;
  };

  if (appWithInstallFlag[INSTALL_KEY]) {
    return;
  }

  appWithInstallFlag[INSTALL_KEY] = true;

  installableExports.forEach((component) => {
    app.use(component);
  });
}

export default {
  install
};
