import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { XyDetailPage } from "@xiaoye/pro-components";

describe("XyDetailPage", () => {
  it("支持渲染头部并展示加载态", () => {
    const wrapper = mount(XyDetailPage, {
      props: {
        title: "任务详情",
        loading: true
      }
    });

    expect(wrapper.text()).toContain("任务详情");
    expect(wrapper.text()).toContain("正在加载数据");
  });

  it("sections 支持直接声明 schema 和 model 并复用 descriptions 显示协议", () => {
    const wrapper = mount(XyDetailPage, {
      props: {
        title: "任务详情",
        sections: [
          {
            key: "basic",
            title: "基础信息",
            model: {
              status: "approved",
              budget: 128000.5
            },
            schema: [
              {
                label: "状态",
                prop: "status",
                valueType: "tag",
                options: [
                  {
                    label: "已通过",
                    value: "approved",
                    status: "success"
                  }
                ]
              },
              {
                label: "预算",
                prop: "budget",
                valueType: "money"
              }
            ]
          }
        ]
      }
    });

    expect(wrapper.text()).toContain("基础信息");
    expect(wrapper.text()).toContain("已通过");
    expect(wrapper.text()).toContain("¥128,000.50");
  });

  it("error 态点击重新加载按钮会向宿主派发 retry", async () => {
    const onRetry = vi.fn();
    const wrapper = mount(XyDetailPage, {
      props: {
        title: "任务详情",
        error: "网络异常，加载失败"
      },
      attrs: {
        onRetry
      }
    });

    expect(wrapper.text()).toContain("网络异常，加载失败");

    await wrapper.get(".xy-async-state-container__state button").trigger("click");

    expect(wrapper.emitted("retry")).toHaveLength(1);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
