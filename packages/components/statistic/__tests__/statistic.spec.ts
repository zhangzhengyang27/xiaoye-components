import { mount } from "@vue/test-utils";
import { h, nextTick, ref } from "vue";
import { describe, expect, it } from "vitest";
import Statistic from "../src/statistic.vue";

describe("XyStatistic", () => {
  it("支持标题和基础千分位渲染", () => {
    const wrapper = mount(Statistic, {
      props: {
        title: "累计成交额",
        value: 57454157
      }
    });

    expect(wrapper.classes()).toContain("xy-statistic");
    expect(wrapper.get(".xy-statistic__head").text()).toBe("累计成交额");
    expect(wrapper.get(".xy-statistic__value").text()).toBe("57,454,157");
  });

  it("precision 使用四舍五入并补零", async () => {
    const precision = ref(2);
    const wrapper = mount(() =>
      h(Statistic, {
        value: 268500.123456,
        precision: precision.value
      })
    );

    expect(wrapper.get(".xy-statistic__value").text()).toBe("268,500.12");

    precision.value = 4;
    await nextTick();

    expect(wrapper.get(".xy-statistic__value").text()).toBe("268,500.1235");
  });

  it("formatter 优先级高于内置分隔和精度规则", () => {
    const wrapper = mount(Statistic, {
      props: {
        value: 12000.345,
        precision: 2,
        formatter: (value) => `≈ ${value}`
      }
    });

    expect(wrapper.get(".xy-statistic__value").text()).toBe("≈ 12000.345");
  });

  it("title prefix suffix 插槽会覆盖同名 prop", () => {
    const wrapper = mount(Statistic, {
      props: {
        title: "原始标题",
        prefix: "¥",
        suffix: "元"
      },
      slots: {
        title: () => "自定义标题",
        prefix: () => h("strong", "USD"),
        suffix: () => h("em", "月度")
      }
    });

    expect(wrapper.get(".xy-statistic__head").text()).toBe("自定义标题");
    expect(wrapper.get(".xy-statistic__prefix").text()).toBe("USD");
    expect(wrapper.get(".xy-statistic__suffix").text()).toBe("月度");
  });

  it("字符串和非有限数字会按原值直出", async () => {
    const wrapper = mount(Statistic, {
      props: {
        value: "N/A"
      }
    });

    expect(wrapper.get(".xy-statistic__value").text()).toBe("N/A");

    await wrapper.setProps({
      value: Number.POSITIVE_INFINITY
    });

    expect(wrapper.get(".xy-statistic__value").text()).toBe("Infinity");
  });

  it("暴露 displayValue", () => {
    const wrapper = mount(Statistic, {
      props: {
        value: 12345.678,
        precision: 2
      }
    });

    expect((wrapper.vm as { displayValue: string | number }).displayValue).toBe("12,345.68");
  });
});
