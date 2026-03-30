import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyDialog, XyDrawer } from "@xiaoye/components";
import { XyDetailPanel } from "@xiaoye/pro-components";

describe("XyDetailPanel", () => {
  it("在 drawer 模式下渲染详情抽屉", () => {
    const wrapper = mount(XyDetailPanel, {
      props: {
        open: true,
        container: "drawer",
        title: "账单详情"
      }
    });

    expect(wrapper.findComponent(XyDrawer).exists()).toBe(true);
  });

  it("在 dialog 模式下渲染详情弹窗", () => {
    const wrapper = mount(XyDetailPanel, {
      props: {
        open: true,
        container: "dialog",
        title: "账单详情"
      }
    });

    expect(wrapper.findComponent(XyDialog).exists()).toBe(true);
  });
});
