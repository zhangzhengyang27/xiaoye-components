import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyProgress } from "@xiaoye/components";

vi.mock("@iconify/vue", () => ({
  Icon: defineComponent({
    name: "MockIconifyIcon",
    inheritAttrs: false,
    props: {
      icon: {
        type: String,
        required: true
      }
    },
    setup(props, { attrs }) {
      return () => h("svg", { ...attrs, "data-icon": props.icon });
    }
  })
}));

describe("XyProgress", () => {
  it("支持基础线形进度渲染", () => {
    const wrapper = mount(XyProgress, {
      props: {
        percentage: 66
      }
    });

    const inner = wrapper.get(".xy-progress__bar-inner").element as HTMLElement;

    expect(wrapper.attributes("aria-valuenow")).toBe("66");
    expect(inner.style.width).toBe("66%");
    expect(wrapper.get(".xy-progress__text").text()).toBe("66%");
  });

  it("会收敛超界百分比并显示状态图标", () => {
    const wrapper = mount(XyProgress, {
      props: {
        percentage: 140,
        status: "success"
      }
    });

    const inner = wrapper.get(".xy-progress__bar-inner").element as HTMLElement;

    expect(wrapper.attributes("aria-valuenow")).toBe("100");
    expect(inner.style.width).toBe("100%");
    expect(wrapper.find('[data-icon="mdi:check-circle"]').exists()).toBe(true);
  });

  it("支持条内文本与格式化函数", () => {
    const wrapper = mount(XyProgress, {
      props: {
        percentage: 42,
        textInside: true,
        strokeWidth: 18,
        format: (percentage) => `完成 ${percentage}`
      }
    });

    expect(wrapper.classes()).toContain("xy-progress--text-inside");
    expect(wrapper.find(".xy-progress__text").exists()).toBe(false);
    expect(wrapper.get(".xy-progress__bar-inner-text").text()).toBe("完成 42");
  });

  it("支持 circle 模式", () => {
    const wrapper = mount(XyProgress, {
      props: {
        type: "circle",
        percentage: 48,
        width: 120
      }
    });

    expect(wrapper.classes()).toContain("xy-progress--circle");
    expect(wrapper.get(".xy-progress__circle").attributes("style")).toContain("width: 120px;");
    expect(wrapper.findAll("path")).toHaveLength(2);
    expect(wrapper.get(".xy-progress__text").text()).toBe("48%");
  });

  it("支持 dashboard 模式和默认插槽覆盖文案", () => {
    const wrapper = mount(XyProgress, {
      props: {
        type: "dashboard",
        percentage: 72
      },
      slots: {
        default: ({ percentage }) => h("strong", `${percentage} 分`)
      }
    });

    expect(wrapper.classes()).toContain("xy-progress--dashboard");
    expect(wrapper.get(".xy-progress__text").text()).toBe("72 分");
  });

  it("默认插槽可以覆盖线形文案", () => {
    const wrapper = mount(XyProgress, {
      props: {
        percentage: 40
      },
      slots: {
        default: () => h("strong", "自定义内容")
      }
    });

    expect(wrapper.get(".xy-progress__text").text()).toBe("自定义内容");
  });

  it("showText 为 false 时隐藏外部文案", () => {
    const wrapper = mount(XyProgress, {
      props: {
        percentage: 54,
        showText: false
      }
    });

    expect(wrapper.classes()).toContain("xy-progress--without-text");
    expect(wrapper.find(".xy-progress__text").exists()).toBe(false);
  });

  it("支持字符串、函数和分段数组三种颜色策略", () => {
    const stringWrapper = mount(XyProgress, {
      props: {
        percentage: 30,
        color: "#111827"
      }
    });

    const functionWrapper = mount(XyProgress, {
      props: {
        percentage: 80,
        color: (percentage) => (percentage > 60 ? "#059669" : "#dc2626")
      }
    });

    const arrayWrapper = mount(XyProgress, {
      props: {
        percentage: 65,
        color: [
          { color: "#dc2626", percentage: 30 },
          { color: "#f59e0b", percentage: 70 },
          { color: "#059669", percentage: 100 }
        ]
      }
    });

    expect((stringWrapper.get(".xy-progress__bar-inner").element as HTMLElement).style.backgroundColor).toBe(
      "rgb(17, 24, 39)"
    );
    expect((functionWrapper.get(".xy-progress__bar-inner").element as HTMLElement).style.backgroundColor).toBe(
      "rgb(5, 150, 105)"
    );
    expect((arrayWrapper.get(".xy-progress__bar-inner").element as HTMLElement).style.backgroundColor).toBe(
      "rgb(245, 158, 11)"
    );
  });

  it("颜色函数和分段数组会响应百分比变化", async () => {
    const functionPercentage = ref(10);
    const functionWrapper = mount(() =>
      h(XyProgress, {
        percentage: functionPercentage.value,
        color: (percentage) => (percentage > 50 ? "#059669" : "#dc2626")
      })
    );

    expect((functionWrapper.get(".xy-progress__bar-inner").element as HTMLElement).style.backgroundColor).toBe(
      "rgb(220, 38, 38)"
    );

    functionPercentage.value = 88;
    await nextTick();

    expect((functionWrapper.get(".xy-progress__bar-inner").element as HTMLElement).style.backgroundColor).toBe(
      "rgb(5, 150, 105)"
    );

    const arrayPercentage = ref(12);
    const arrayWrapper = mount(() =>
      h(XyProgress, {
        percentage: arrayPercentage.value,
        color: [
          { color: "#dc2626", percentage: 30 },
          { color: "#f59e0b", percentage: 70 },
          { color: "#059669", percentage: 100 }
        ]
      })
    );

    expect((arrayWrapper.get(".xy-progress__bar-inner").element as HTMLElement).style.backgroundColor).toBe(
      "rgb(220, 38, 38)"
    );

    arrayPercentage.value = 68;
    await nextTick();

    expect((arrayWrapper.get(".xy-progress__bar-inner").element as HTMLElement).style.backgroundColor).toBe(
      "rgb(245, 158, 11)"
    );
  });

  it("分段颜色命中阈值时会切换到下一段", () => {
    const wrapper = mount(XyProgress, {
      props: {
        percentage: 30,
        color: [
          { color: "#dc2626", percentage: 30 },
          { color: "#f59e0b", percentage: 70 },
          { color: "#059669", percentage: 100 }
        ]
      }
    });

    expect((wrapper.get(".xy-progress__bar-inner").element as HTMLElement).style.backgroundColor).toBe(
      "rgb(245, 158, 11)"
    );
  });

  it("支持条纹流动和不确定进度状态", () => {
    const wrapper = mount(XyProgress, {
      props: {
        percentage: 52,
        indeterminate: true,
        stripedFlow: true
      }
    });

    const inner = wrapper.get(".xy-progress__bar-inner");

    expect(inner.classes()).toContain("xy-progress__bar-inner--indeterminate");
    expect(inner.classes()).toContain("xy-progress__bar-inner--striped");
    expect(inner.classes()).toContain("xy-progress__bar-inner--striped-flow");
    expect((inner.element as HTMLElement).style.animationDuration).toBe("3s");
  });

  it("不确定进度会切换为忙碌状态并省略 aria-valuenow", () => {
    const wrapper = mount(XyProgress, {
      props: {
        percentage: 52,
        indeterminate: true
      }
    });

    expect(wrapper.attributes("aria-busy")).toBe("true");
    expect(wrapper.attributes("aria-valuenow")).toBeUndefined();
    expect(wrapper.attributes("aria-valuetext")).toBeUndefined();
  });

  it("circle 模式会兜底非法宽度和描边值", () => {
    const wrapper = mount(XyProgress, {
      props: {
        type: "circle",
        percentage: 40,
        width: 0,
        strokeWidth: -8
      }
    });

    expect(wrapper.get(".xy-progress__circle").attributes("style")).toContain("width: 126px;");
    expect(wrapper.get(".xy-progress__circle").attributes("style")).toContain("height: 126px;");
    expect(wrapper.find(".xy-progress__circle-path").attributes("stroke-width")).toBe("4.8");
  });
});
