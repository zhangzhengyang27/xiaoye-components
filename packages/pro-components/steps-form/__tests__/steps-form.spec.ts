import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyStepsForm } from "@xiaoye/pro-components";

describe("XyStepsForm", () => {
  it("支持渲染步骤并推进到下一步", async () => {
    const wrapper = mount(XyStepsForm, {
      props: {
        model: {
          name: "小叶"
        },
        steps: [
          {
            key: "basic",
            title: "基础信息"
          },
          {
            key: "confirm",
            title: "确认信息"
          }
        ]
      },
      slots: {
        default: ({ step }: { step: { title: string } }) =>
          h("div", { class: "step-slot" }, step.title)
      }
    });

    expect(wrapper.text()).toContain("基础信息");

    await wrapper.get(".xy-button--primary").trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:active")?.[0]?.[0]).toBe(1);
    expect(wrapper.emitted("next")?.[0]?.[0]).toBe(1);
  });

  it("readonly + schema 时使用只读展示协议并隐藏提交动作", () => {
    const wrapper = mount(XyStepsForm, {
      props: {
        readonly: true,
        model: {
          owner: "小叶",
          status: "reviewing"
        },
        steps: [
          {
            key: "review",
            title: "复核信息",
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
              }
            ]
          }
        ]
      }
    });

    expect(wrapper.find(".xy-descriptions").exists()).toBe(true);
    expect(wrapper.text()).toContain("负责人");
    expect(wrapper.text()).toContain("小叶");
    expect(wrapper.text()).toContain("审核中");
    expect(wrapper.text()).not.toContain("提交");
  });
});
