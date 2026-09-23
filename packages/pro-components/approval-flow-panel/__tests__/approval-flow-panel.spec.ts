import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyApprovalFlowPanel } from "@xiaoye/pro-components";

describe("XyApprovalFlowPanel", () => {
  it("支持渲染节点并触发节点点击", async () => {
    const node = {
      key: "review",
      title: "审批中",
      status: "process" as const
    };
    const wrapper = mount(XyApprovalFlowPanel, {
      props: {
        nodes: [node]
      }
    });

    expect(wrapper.text()).toContain("审批中");

    await wrapper.get(".xy-approval-flow-panel__node").trigger("click");

    expect(wrapper.emitted("node-click")?.[0]?.[0]).toEqual(node);
  });

  it("步骤条真实渲染 xy-step 节点", () => {
    const wrapper = mount(XyApprovalFlowPanel, {
      props: {
        nodes: [
          { key: "draft", title: "草稿", status: "finish" },
          { key: "review", title: "审批中", status: "process" },
          { key: "archive", title: "完成", status: "wait" }
        ]
      }
    });

    expect(wrapper.findAll(".xy-steps__item")).toHaveLength(3);
    expect(wrapper.findAll(".xy-steps__title").map((node) => node.text())).toEqual([
      "草稿",
      "审批中",
      "完成"
    ]);
  });
});
