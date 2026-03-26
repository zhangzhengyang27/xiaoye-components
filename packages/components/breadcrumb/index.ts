import Breadcrumb from "./src/breadcrumb.vue";
import BreadcrumbItem from "./src/breadcrumb-item.vue";
import type { SFCWithInstall } from "@xiaoye/utils";
import { withInstall } from "@xiaoye/utils";
import type { BreadcrumbProps } from "./src/breadcrumb";
import type { BreadcrumbItemProps, BreadcrumbRouteTarget } from "./src/breadcrumb-item";

export type { BreadcrumbItemProps, BreadcrumbProps, BreadcrumbRouteTarget };

export const XyBreadcrumbItem = withInstall(BreadcrumbItem, "xy-breadcrumb-item");

export const XyBreadcrumb = withInstall(Breadcrumb, "xy-breadcrumb") as SFCWithInstall<
  typeof Breadcrumb
> & {
  Item: typeof XyBreadcrumbItem;
};

XyBreadcrumb.Item = XyBreadcrumbItem;

export default XyBreadcrumb;
