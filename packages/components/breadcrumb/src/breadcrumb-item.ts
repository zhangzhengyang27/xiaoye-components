import type { LinkTarget } from "../../link/src/link";

export type BreadcrumbRouteTarget = string | Record<string, unknown>;

export interface BreadcrumbItemProps {
  to?: BreadcrumbRouteTarget;
  replace?: boolean;
  href?: string;
  target?: LinkTarget;
  disabled?: boolean;
}
