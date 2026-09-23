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

  it("步骤条真实渲染 xy-step 节点", () => {
    const wrapper = mount(XyImportWizard, {
      props: {
        steps: [
          { key: "confirm", title: "确认导入" },
          { key: "upload", title: "上传文件" },
          { key: "result", title: "完成" }
        ]
      }
    });

    expect(wrapper.findAll(".xy-steps__item")).toHaveLength(3);
    expect(wrapper.findAll(".xy-steps__title").map((node) => node.text())).toEqual([
      "确认导入",
      "上传文件",
      "完成"
    ]);
  });

  it("非受控模式从索引 2 点上一步，prev 载荷为 1", async () => {
    const wrapper = mount(XyImportWizard, {
      props: {
        defaultActive: 2,
        steps: [
          { key: "confirm", title: "确认导入" },
          { key: "upload", title: "上传文件" },
          { key: "result", title: "完成" }
        ]
      }
    });

    await wrapper
      .get(".xy-import-wizard__footer .xy-button:not(.xy-button--primary)")
      .trigger("click");
    await nextTick();

    expect(wrapper.emitted("prev")?.[0]?.[0]).toBe(1);
    expect(wrapper.emitted("update:active")?.[0]?.[0]).toBe(1);
  });

  it("非受控模式从索引 1 点上一步，prev 载荷为 0", async () => {
    const wrapper = mount(XyImportWizard, {
      props: {
        defaultActive: 1,
        steps: [
          { key: "confirm", title: "确认导入" },
          { key: "upload", title: "上传文件" }
        ]
      }
    });

    await wrapper
      .get(".xy-import-wizard__footer .xy-button:not(.xy-button--primary)")
      .trigger("click");
    await nextTick();

    expect(wrapper.emitted("prev")?.[0]?.[0]).toBe(0);
    expect(wrapper.emitted("update:active")?.[0]?.[0]).toBe(0);
  });
});
