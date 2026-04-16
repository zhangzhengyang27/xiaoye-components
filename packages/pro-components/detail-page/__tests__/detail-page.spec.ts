import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
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
});
