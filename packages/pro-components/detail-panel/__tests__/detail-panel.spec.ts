import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
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

  it("支持通过 schema 和 model 直接渲染详情字段", async () => {
    const wrapper = mount(XyDetailPanel, {
      props: {
        open: true,
        title: "任务详情",
        drawerProps: {
          appendToBody: false
        },
        model: {
          owner: "小叶",
          status: "reviewing",
          budget: 128000.5
        },
        schema: [
          {
            prop: "owner",
            label: "负责人"
          },
          {
            prop: "status",
            label: "状态",
            valueType: "tag",
            options: [
              {
                label: "审核中",
                value: "reviewing",
                status: "warning"
              }
            ]
          },
          {
            prop: "budget",
            label: "预算",
            valueType: "money"
          }
        ]
      }
    });

    await nextTick();

    expect(wrapper.text()).toContain("负责人");
    expect(wrapper.text()).toContain("小叶");
    expect(wrapper.text()).toContain("审核中");
    expect(wrapper.text()).toContain("¥128,000.50");
  });
});
