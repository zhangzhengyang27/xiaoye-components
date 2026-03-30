import { h } from "vue";
import { XyPageContainer, type PageContainerProps } from "@xiaoye/pro-components";

const props: PageContainerProps = {
  title: "成员中心",
  description: "统一承接头部与主体内容",
  metaItems: [
    {
      label: "负责人",
      value: "小叶",
      icon: "mdi:account"
    }
  ],
  bordered: true,
  shadow: true,
  loading: false,
  bodyClass: "page-container-body",
  bodyStyle: {
    padding: "24px"
  }
};

const vnode = h(XyPageContainer, props);

void props;
void vnode;
