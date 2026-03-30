import XiaoyeProComponents, {
  XyApprovalFlowPanel,
  XyAuditTimeline,
  XyAvatarMenu,
  XyAsyncStateContainer,
  XyColumnSettingPanel,
  XyCrudPage,
  XyDetailPage,
  XyDetailPanel,
  XyExportTaskPanel,
  XyFilterPanel,
  XyHeaderTabs,
  XyImportResultTable,
  XyImportWizard,
  XyLoginForm,
  XyListPage,
  XyNoticeCenter,
  XyOverlayForm,
  XyPageContainer,
  XyPageHeader,
  XyPageToolbar,
  XyProForm,
  XyProTable,
  XyRequestForm,
  XySavedViewTabs,
  XySearchForm,
  XySplitLayoutPage,
  XyStatCard,
  XyStepsForm,
  XyTableFilterDrawer,
  type ApprovalFlowNode,
  type AvatarMenuItem,
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
  type HeaderTabItem,
  type ImportResultSummary,
  type ImportWizardStep,
  type LoginFormInstance,
  type LoginFormModel,
  type LoginFormProps,
  type LoginFormThirdPartyItem,
  type ListPageProps,
  type ListPageBatchAction,
  type NoticeCenterTab,
  type OverlayFormProps,
  type OverlayFormSubmitPayload,
  type PageContainerProps,
  type PageHeaderProps,
  type PageIcon,
  type PageMetaItem,
  type PageToolbarProps,
  type ProFormProps,
  type ProTableProps,
  type RequestFormSubmitContext,
  type SavedViewTabItem,
  type SearchFormField,
  type SplitLayoutPageProps,
  type StatCardProps,
  type StatTrend
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

const loginFormModel: LoginFormModel = {
  username: "xiaoye",
  password: "123456",
  remember: true
};

const loginFormThirdPartyItems: LoginFormThirdPartyItem[] = [
  {
    key: "wechat",
    label: "微信登录",
    icon: "mdi:wechat"
  }
];

const loginFormProps: LoginFormProps = {
  model: loginFormModel,
  title: "欢迎登录",
  thirdPartyItems: loginFormThirdPartyItems
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
  ],
  draggableRow: true,
  draggableColumn: true
};

const headerTabItems: HeaderTabItem[] = [
  {
    key: "overview",
    label: "概览"
  }
];

const noticeCenterTabs: NoticeCenterTab[] = [
  {
    key: "notice",
    label: "通知",
    items: []
  }
];

const statTrend: StatTrend = "up";

const statCardProps: StatCardProps = {
  title: "成交额",
  value: 128000,
  description: "较上周继续提升",
  icon: "mdi:cash-multiple",
  trend: statTrend,
  trendText: "环比 +12%",
  loading: false
};

const filterPanelProps: FilterPanelProps = {
  title: "筛选条件"
};

const pageToolbarProps: PageToolbarProps = {
  title: "成员中心",
  bordered: true
};

const pageIcon: PageIcon = "mdi:account-circle";

const pageMetaItems: PageMetaItem[] = [
  {
    label: "负责人",
    value: "小叶",
    icon: pageIcon
  }
];

const pageHeaderProps: PageHeaderProps = {
  title: "成员中心",
  description: "统一承接页面标题和辅助信息",
  metaItems: pageMetaItems,
  divider: true,
  bordered: true
};

const pageContainerProps: PageContainerProps = {
  ...pageHeaderProps,
  loading: false,
  shadow: true,
  bodyClass: "page-container-body",
  bodyStyle: {
    padding: "24px"
  }
};

const avatarMenuItems: AvatarMenuItem[] = [
  {
    key: "profile",
    label: "个人中心"
  }
];

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
void XyLoginForm;
void XyPageHeader;
void XyPageContainer;
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
void XyPageToolbar;
void XyAvatarMenu;
void XyHeaderTabs;
void XyNoticeCenter;
void XyStatCard;
void fields;
void proFormProps;
void loginFormModel;
void loginFormThirdPartyItems;
void loginFormProps;
void overlayFormProps;
void overlayPayload;
void tableProps;
void filterPanelProps;
void pageToolbarProps;
void pageIcon;
void pageMetaItems;
void pageHeaderProps;
void pageContainerProps;
void avatarMenuItems;
void requestFormContext;
void headerTabItems;
void noticeCenterTabs;
void statTrend;
void statCardProps;
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

declare const loginFormInstance: LoginFormInstance;

void loginFormInstance.validate;
void loginFormInstance.submit;
void loginFormInstance.focus;
