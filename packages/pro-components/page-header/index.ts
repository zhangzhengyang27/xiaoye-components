import PageHeader from "./src/page-header.vue";
import type { PageHeaderProps, PageIcon, PageMetaItem } from "./src/page-header";
import { withInstall } from "@xiaoye/utils";

export type { PageHeaderProps, PageIcon, PageMetaItem };

export const XyPageHeader = withInstall(PageHeader, "xy-page-header");
export default XyPageHeader;
