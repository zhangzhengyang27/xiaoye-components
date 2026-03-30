import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyAuditTimeline } from "@xiaoye/pro-components";

describe("XyAuditTimeline", () => {
  it("支持状态映射、备注和附件插槽", () => {
    const wrapper = mount(XyAuditTimeline, {
      props: {
        items: [
          {
            id: "audit-1",
            title: "发起审批",
            operator: "小叶",
            timestamp: "2026-03-21 09:10",
            status: "success",
            description: "已发起审批流程。"
          },
          {
            id: "audit-2",
            title: "驳回申请",
            operator: "审核人",
            timestamp: "2026-03-21 10:10",
            status: "danger",
            remark: "缺少补充截图。",
            attachments: [
              {
                label: "审批截图.png"
              }
            ]
          }
        ]
      },
      slots: {
        attachments: ({ item }: { item: { attachments?: Array<{ label: string }> } }) => {
          return item.attachments?.map((attachment) => attachment.label).join(" / ");
        }
      }
    });

    expect(wrapper.text()).toContain("发起审批");
    expect(wrapper.text()).toContain("小叶");
    expect(wrapper.text()).toContain("缺少补充截图");
    expect(wrapper.text()).toContain("审批截图.png");
    expect(wrapper.find(".xy-timeline-item--success").exists()).toBe(true);
    expect(wrapper.find(".xy-timeline-item--danger").exists()).toBe(true);
  });

  it("items 为空时展示空态", () => {
    const wrapper = mount(XyAuditTimeline, {
      props: {
        items: [],
        emptyText: "暂无历史"
      }
    });

    expect(wrapper.text()).toContain("暂无历史");
  });
});
