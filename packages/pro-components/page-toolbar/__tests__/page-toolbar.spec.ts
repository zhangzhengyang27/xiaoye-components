import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyPageToolbar } from "@xiaoye/pro-components";

describe("XyPageToolbar", () => {
  it("支持标题、描述、actions 与默认内容", () => {
    const wrapper = mount(XyPageToolbar, {
      props: {
        title: "成员中心",
        description: "统一承接列表页顶部操作区",
        bordered: true,
        divider: true
      },
      slots: {
        actions: '<button class="toolbar-action">新建</button>',
        default: '<div class="toolbar-content">筛选区域</div>'
      }
    });

    expect(wrapper.text()).toContain("成员中心");
    expect(wrapper.text()).toContain("统一承接列表页顶部操作区");
    expect(wrapper.find(".toolbar-action").exists()).toBe(true);
    expect(wrapper.find(".toolbar-content").exists()).toBe(true);
    expect(wrapper.classes()).toContain("is-bordered");
  });

  it("sticky 模式会带上固定样式", () => {
    const wrapper = mount(XyPageToolbar, {
      props: {
        sticky: true,
        offsetTop: 64
      }
    });

    expect(wrapper.classes()).toContain("is-sticky");
    expect(wrapper.attributes("style")).toContain("top: 64px");
  });
});
