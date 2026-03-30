import { h } from "vue";
import { XyPageToolbar, type PageToolbarProps } from "@xiaoye/pro-components";

const props: PageToolbarProps = {
  title: "成员中心",
  description: "统一承接页面顶部操作区",
  sticky: true,
  offsetTop: 64,
  bordered: true,
  divider: true
};

const vnode = h(XyPageToolbar, props);

void props;
void vnode;
