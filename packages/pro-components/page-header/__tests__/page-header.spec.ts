import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyPageHeader } from "@xiaoye/pro-components";

describe("XyPageHeader", () => {
  it("支持标题、描述、metaItems 与 actions 渲染", () => {
    const wrapper = mount(XyPageHeader, {
      props: {
        title: "成员中心",
        description: "统一承接页面标题与辅助信息",
        metaItems: [
          {
            label: "负责人",
            value: "小叶",
            icon: "mdi:account"
          }
        ]
      },
      slots: {
        actions: '<button class="page-header-action">新建成员</button>'
      }
    });

    expect(wrapper.text()).toContain("成员中心");
    expect(wrapper.text()).toContain("统一承接页面标题与辅助信息");
    expect(wrapper.text()).toContain("负责人");
    expect(wrapper.text()).toContain("小叶");
    expect(wrapper.find(".page-header-action").exists()).toBe(true);
  });

  it("divider 和 bordered 会带上对应视觉类名", () => {
    const wrapper = mount(XyPageHeader, {
      props: {
        divider: true,
        bordered: true
      }
    });

    expect(wrapper.classes()).toContain("is-divider");
    expect(wrapper.classes()).toContain("is-bordered");
  });
});
