import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyImportWizard } from "@xiaoye/pro-components";

describe("XyImportWizard", () => {
  it("支持渲染步骤并推进下一步", async () => {
    const wrapper = mount(XyImportWizard, {
      props: {
        steps: [
          {
            key: "confirm",
            title: "确认导入"
          }
        ]
      },
      slots: {
        default: ({ step }: { step: { title: string } }) =>
          h("div", { class: "wizard-slot" }, step.title)
      }
    });

    expect(wrapper.text()).toContain("确认导入");

    await wrapper.get(".xy-button--primary").trigger("click");
    await nextTick();

    expect(wrapper.emitted("finish")).toHaveLength(1);
  });
});
