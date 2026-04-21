import Breadcrumb from "./src/breadcrumb.vue";
import BreadcrumbItem from "./src/breadcrumb-item.vue";
import type { SFCWithInstall } from "@xiaoye/primitives";
import { withInstall } from "@xiaoye/primitives";
import type { BreadcrumbItemData, BreadcrumbProps } from "./src/breadcrumb";
import type { BreadcrumbItemProps, BreadcrumbRouteTarget } from "./src/breadcrumb-item";

export type { BreadcrumbItemData, BreadcrumbItemProps, BreadcrumbProps, BreadcrumbRouteTarget };

export const XyBreadcrumbItem = withInstall(BreadcrumbItem, "xy-breadcrumb-item");

export const XyBreadcrumb = withInstall(Breadcrumb, "xy-breadcrumb") as SFCWithInstall<
  typeof Breadcrumb
> & {
  Item: typeof XyBreadcrumbItem;
};

XyBreadcrumb.Item = XyBreadcrumbItem;

export default XyBreadcrumb;
