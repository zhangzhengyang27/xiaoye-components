import XiaoyeProComponents, {
  XyApprovalFlowPanel,
  XyAuditTimeline,
  XyAsyncStateContainer,
  XyColumnSettingPanel,
  XyCrudPage,
  XyDetailPage,
  XyDetailPanel,
  XyExportTaskPanel,
  XyFilterPanel,
  XyImportResultTable,
  XyImportWizard,
  XyListPage,
  XyOverlayForm,
  XyProForm,
  XyProTable,
  XyRequestForm,
  XySavedViewTabs,
  XySearchForm,
  XySplitLayoutPage,
  XyStepsForm,
  XyTableFilterDrawer,
  type ApprovalFlowNode,
  type AsyncStateContainerProps,
  type AuditTimelineEntry,
  type ColumnSettingPanelColumn,
  type CrudPageProps,
  type DetailPageAction,
  type DetailPageAttachmentFile,
  type DetailPageBreadcrumbItem,
  type DetailPageProps,
  type DetailPanelProps,
  type ExportTaskItem,
  type FilterPanelProps,
  type ImportResultSummary,
  type ImportWizardStep,
  type ListPageProps,
  type ListPageBatchAction,
  type OverlayFormProps,
  type OverlayFormSubmitPayload,
  type ProFormProps,
  type ProTableProps,
  type RequestFormSubmitContext,
  type SavedViewTabItem,
  type SearchFormField,
  type SplitLayoutPageProps
} from "xiaoye-pro-components";

interface Row {
  id: number;
  name: string;
}

const fields: SearchFormField[] = [
  {
    prop: "keyword",
    label: "关键词",
    component: "input"
  }
];

const proFormProps: ProFormProps = {
  model: {
    name: "控制台"
  }
};

const overlayFormProps: OverlayFormProps = {
  open: true,
  container: "drawer",
  model: {
    name: "控制台"
  }
};

const overlayPayload: OverlayFormSubmitPayload = {
  mode: "edit",
  model: {
    name: "控制台"
  }
};

const tableProps: ProTableProps<Row> = {
  data: [{ id: 1, name: "控制台" }],
  columns: [
    {
      prop: "name",
      label: "名称"
    }
  ]
};

const filterPanelProps: FilterPanelProps = {
  title: "筛选条件"
};

const requestFormContext: RequestFormSubmitContext = {
  action: "submit",
  params: {
    name: "控制台"
  },
  page: 1,
  pageSize: 10,
  model: {
    name: "控制台"
  }
};

const columnSettingColumns: ColumnSettingPanelColumn[] = [
  {
    key: "name",
    label: "名称"
  }
];

const savedViewItems: SavedViewTabItem[] = [
  {
    key: "all",
    label: "全部"
  }
];

const importSummary: ImportResultSummary = {
  total: 1,
  success: 1,
  failed: 0
};

const auditItems: AuditTimelineEntry[] = [
  {
    id: "audit-1",
    title: "记录创建",
    status: "success"
  }
];

const detailPanelProps: DetailPanelProps = {
  open: true,
  title: "详情面板",
  container: "drawer"
};

const detailPageProps: DetailPageProps = {
  title: "详情页",
  sections: [
    {
      key: "basic",
      title: "基础信息"
    }
  ]
};

const detailPageBreadcrumbs: DetailPageBreadcrumbItem[] = [
  {
    label: "工作台",
    href: "/workspace"
  }
];

const detailPageActions: DetailPageAction[] = [
  {
    key: "refresh",
    label: "刷新"
  }
];

const detailPageAttachments: DetailPageAttachmentFile[] = [
  {
    id: "file-1",
    name: "明细.csv"
  }
];

const asyncStateProps: AsyncStateContainerProps = {
  empty: true
};

const listPageProps: ListPageProps<Row> = {
  columns: [
    {
      prop: "name",
      label: "名称"
    }
  ],
  data: [{ id: 1, name: "控制台" }]
};

const listPageBatchActions: ListPageBatchAction[] = [
  {
    key: "archive",
    label: "批量归档"
  }
];

const crudPageProps: CrudPageProps<Row> = {
  columns: [
    {
      prop: "name",
      label: "名称"
    }
  ],
  data: [{ id: 1, name: "控制台" }],
  formModel: {
    name: ""
  }
};

const splitLayoutPageProps: SplitLayoutPageProps = {
  title: "双栏页面",
  layout: "master-detail"
};

const approvalNodes: ApprovalFlowNode[] = [
  {
    key: "approve",
    title: "审批中",
    status: "process"
  }
];

const importWizardSteps: ImportWizardStep[] = [
  {
    key: "upload",
    title: "上传文件"
  }
];

const exportTasks: ExportTaskItem[] = [
  {
    id: "task-1",
    name: "导出任务",
    status: "success"
  }
];

void XiaoyeProComponents;
void XySearchForm;
void XyProForm;
void XyOverlayForm;
void XyStepsForm;
void XyFilterPanel;
void XyRequestForm;
void XyProTable;
void XyColumnSettingPanel;
void XySavedViewTabs;
void XyTableFilterDrawer;
void XyImportResultTable;
void XyAuditTimeline;
void XyDetailPanel;
void XyDetailPage;
void XyAsyncStateContainer;
void XyListPage;
void XyCrudPage;
void XySplitLayoutPage;
void XyApprovalFlowPanel;
void XyImportWizard;
void XyExportTaskPanel;
void fields;
void proFormProps;
void overlayFormProps;
void overlayPayload;
void tableProps;
void filterPanelProps;
void requestFormContext;
void columnSettingColumns;
void savedViewItems;
void importSummary;
void auditItems;
void detailPanelProps;
void detailPageProps;
void detailPageBreadcrumbs;
void detailPageActions;
void detailPageAttachments;
void asyncStateProps;
void listPageProps;
void listPageBatchActions;
void crudPageProps;
void splitLayoutPageProps;
void approvalNodes;
void importWizardSteps;
void exportTasks;
