import { h } from "vue";
import {
  XyHeaderTabs,
  type HeaderTabItem,
  type HeaderTabsMenuAction,
  type HeaderTabsProps
} from "@xiaoye/pro-components";

const action: HeaderTabsMenuAction = "close-all";

const items: HeaderTabItem[] = [
  {
    key: "overview",
    label: "概览"
  },
  {
    key: "orders",
    label: "订单",
    badge: 8
  }
];

const props: HeaderTabsProps = {
  items,
  closable: true,
  editable: true
};

const vnode = h(XyHeaderTabs, props);

void action;
void items;
void props;
void vnode;
