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
});
