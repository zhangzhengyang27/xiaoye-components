import DetailPage from "./src/detail-page.vue";
import type {
  DetailPageAction,
  DetailPageAttachmentFile,
  DetailPageBreadcrumbItem,
  DetailPageProps
} from "./src/detail-page";
import { withInstall } from "@xiaoye/primitives";

export type {
  DetailPageAction,
  DetailPageAttachmentFile,
  DetailPageBreadcrumbItem,
  DetailPageProps
};

export const XyDetailPage = withInstall(DetailPage, "xy-detail-page");

export default XyDetailPage;
