import { h } from "vue";
import {
  XyPageHeader,
  type PageHeaderProps,
  type PageIcon,
  type PageMetaItem
} from "@xiaoye/pro-components";

const icon: PageIcon = "mdi:account-circle";

const metaItems: PageMetaItem[] = [
  {
    label: "负责人",
    value: "小叶",
    icon
  }
];

const props: PageHeaderProps = {
  title: "成员中心",
  description: "统一承接页面标题与辅助信息",
  metaItems,
  divider: true,
  bordered: true
};

const vnode = h(XyPageHeader, props);

void icon;
void metaItems;
void props;
void vnode;
