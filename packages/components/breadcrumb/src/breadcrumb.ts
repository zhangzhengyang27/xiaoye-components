import type { LinkTarget } from "../../link";
import type { BreadcrumbRouteTarget } from "./breadcrumb-item";

export interface BreadcrumbItemData {
  label: string;
  to?: BreadcrumbRouteTarget;
  replace?: boolean;
  href?: string;
  target?: LinkTarget;
  disabled?: boolean;
}

export interface BreadcrumbProps {
  separator?: string;
  separatorIcon?: string;
  ariaLabel?: string;
  items?: BreadcrumbItemData[];
}
