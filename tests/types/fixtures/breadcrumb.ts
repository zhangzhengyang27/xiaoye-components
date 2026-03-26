import { h } from "vue";
import {
  XyBreadcrumb,
  XyBreadcrumbItem,
  type BreadcrumbItemProps,
  type BreadcrumbProps
} from "xiaoye-components";

const breadcrumbProps: BreadcrumbProps = {
  separator: ">",
  separatorIcon: "mdi:chevron-right",
  ariaLabel: "订单路径"
};

const breadcrumbItemProps: BreadcrumbItemProps = {
  href: "/orders",
  target: "_blank"
};

const breadcrumbRouteProps: BreadcrumbItemProps = {
  to: {
    path: "/orders/refund"
  },
  replace: true
};

void breadcrumbProps;
void breadcrumbItemProps;
void breadcrumbRouteProps;

const breadcrumbVNode = h(XyBreadcrumb, breadcrumbProps, () => [
  h(XyBreadcrumbItem, breadcrumbItemProps, () => "订单中心"),
  h(XyBreadcrumb.Item, breadcrumbRouteProps, () => "退款详情"),
  h(XyBreadcrumbItem, null, () => "当前页")
]);

void breadcrumbVNode;

const invalidBreadcrumbProps: BreadcrumbProps = {
  // @ts-expect-error separatorIcon should be string
  separatorIcon: 1
};

const invalidBreadcrumbItemProps: BreadcrumbItemProps = {
  // @ts-expect-error invalid target should be rejected
  target: 1
};

void invalidBreadcrumbProps;
void invalidBreadcrumbItemProps;
