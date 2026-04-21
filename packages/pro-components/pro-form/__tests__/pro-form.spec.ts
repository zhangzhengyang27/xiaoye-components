import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyProForm } from "@xiaoye/pro-components";

describe("XyProForm", () => {
  it("支持渲染标题并展示 loading 状态", () => {
    const wrapper = mount(XyProForm, {
      props: {
        title: "成员信息",
        loading: true,
        model: {
          name: "小叶"
        }
      }
    });

    expect(wrapper.text()).toContain("成员信息");
    expect(wrapper.find(".xy-pro-form__loading").exists()).toBe(true);
  });

  it("schema + readonly 时切换为 descriptions 只读展示", () => {
    const wrapper = mount(XyProForm, {
      props: {
        title: "成员信息",
        readonly: true,
        showSubmit: false,
        showReset: false,
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

    expect(wrapper.find(".xy-descriptions").exists()).toBe(true);
    expect(wrapper.find(".xy-form").exists()).toBe(false);
    expect(wrapper.text()).toContain("负责人");
    expect(wrapper.text()).toContain("小叶");
    expect(wrapper.text()).toContain("审核中");
    expect(wrapper.text()).toContain("¥128,000.50");
  });
});
