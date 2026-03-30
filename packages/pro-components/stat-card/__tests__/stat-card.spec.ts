import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyStatCard } from "@xiaoye/pro-components";

describe("XyStatCard", () => {
  it("支持标题、数值、图标和趋势文案渲染", () => {
    const wrapper = mount(XyStatCard, {
      props: {
        title: "本周成交额",
        value: "128,000",
        description: "较上周增长明显",
        icon: "mdi:cash-multiple",
        trend: "up",
        trendText: "环比 +12%"
      }
    });

    expect(wrapper.text()).toContain("本周成交额");
    expect(wrapper.text()).toContain("128,000");
    expect(wrapper.text()).toContain("环比 +12%");
    expect(wrapper.classes()).toContain("is-up");
  });

  it("loading 状态显示骨架占位", () => {
    const wrapper = mount(XyStatCard, {
      props: {
        loading: true
      }
    });

    expect(wrapper.find(".xy-stat-card__skeleton").exists()).toBe(true);
  });
});
