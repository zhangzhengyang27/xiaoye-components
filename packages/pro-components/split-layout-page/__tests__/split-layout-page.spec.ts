import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XySplitLayoutPage } from "@xiaoye/pro-components";

vi.mock("@iconify/vue", () => ({
  Icon: defineComponent({
    name: "MockIconifyIcon",
    inheritAttrs: false,
    props: {
      icon: {
        type: String,
        required: true
      }
    },
    setup(props, { attrs }) {
      return () => h("svg", { ...attrs, "data-icon": props.icon });
    }
  })
}));

describe("XySplitLayoutPage", () => {
  it("支持主从布局", () => {
    const wrapper = mount(XySplitLayoutPage, {
      props: {
        title: "成员主从工作区",
        layout: "master-detail"
      },
      slots: {
        master: () => "左侧列表",
        detail: () => "右侧详情"
      }
    });

    expect(wrapper.text()).toContain("成员主从工作区");
    expect(wrapper.text()).toContain("左侧列表");
    expect(wrapper.text()).toContain("右侧详情");
  });

  it("支持侧栏主内容布局", () => {
    const wrapper = mount(XySplitLayoutPage, {
      props: {
        layout: "aside-main"
      },
      slots: {
        aside: () => "筛选区",
        main: () => "主内容区"
      }
    });

    expect(wrapper.text()).toContain("筛选区");
    expect(wrapper.text()).toContain("主内容区");
  });
});
