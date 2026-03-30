import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyNoticeCenter } from "@xiaoye/pro-components";
import { XyTabs } from "@xiaoye/components";

describe("XyNoticeCenter", () => {
  it("支持切换 tab、点击消息项和底部动作", async () => {
    const wrapper = mount(XyNoticeCenter, {
      props: {
        tabs: [
          {
            key: "notice",
            label: "通知",
            items: [
              {
                key: "notice-1",
                title: "审批完成",
                content: "采购审批已通过"
              }
            ]
          },
          {
            key: "todo",
            label: "待办",
            items: []
          }
        ],
        actions: [
          {
            key: "all-read",
            label: "全部已读"
          }
        ]
      }
    });

    await wrapper.find(".xy-notice-center__item").trigger("click");
    expect(wrapper.emitted("itemClick")?.[0]).toEqual(["notice", "notice-1"]);

    await wrapper.find(".xy-notice-center__footer .xy-button").trigger("click");
    expect(wrapper.emitted("actionClick")?.[0]?.[0]).toMatchObject({ key: "all-read" });

    wrapper.getComponent(XyTabs).vm.$emit("update:modelValue", "todo");
    expect(wrapper.emitted("tabChange")?.[0]).toEqual(["todo"]);
  });

  it("空态列表会渲染 empty", () => {
    const wrapper = mount(XyNoticeCenter, {
      props: {
        tabs: [
          {
            key: "empty",
            label: "空列表",
            items: []
          }
        ],
        emptyText: "暂无新消息"
      }
    });

    expect(wrapper.text()).toContain("暂无新消息");
  });
});
