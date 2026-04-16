import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyExportTaskPanel } from "@xiaoye/pro-components";

describe("XyExportTaskPanel", () => {
  it("支持渲染任务并触发下载事件", async () => {
    const task = {
      id: "task-1",
      name: "成员导出",
      status: "success" as const,
      progress: 100
    };
    const wrapper = mount(XyExportTaskPanel, {
      props: {
        tasks: [task]
      }
    });

    expect(wrapper.text()).toContain("成员导出");

    await wrapper.get(".xy-button").trigger("click");

    expect(wrapper.emitted("download")?.[0]?.[0]).toEqual(task);
  });
});
