import type {
  DetailPageAction,
  DetailPageAttachmentFile,
  DetailPageBreadcrumbItem,
  DetailPageProps
} from "@xiaoye/pro-components";

const breadcrumbs: DetailPageBreadcrumbItem[] = [
  {
    label: "任务中心",
    href: "/tasks"
  }
];

const actions: DetailPageAction[] = [
  {
    key: "edit",
    label: "编辑",
    type: "primary"
  }
];

const attachments: DetailPageAttachmentFile[] = [
  {
    id: 1,
    name: "账单.xlsx"
  }
];

const props: DetailPageProps = {
  title: "任务详情",
  description: "详情页容器",
  breadcrumbs,
  actions,
  sections: [
    {
      key: "basic",
      title: "基础信息"
    }
  ],
  attachments
};

void breadcrumbs;
void actions;
void attachments;
void props;
