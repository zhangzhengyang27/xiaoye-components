import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyConfigProvider } from "../../config-provider";
import { XyResult } from "../index";

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

describe("XyResult", () => {
  it("默认渲染中性结果图标", () => {
    const wrapper = mount(XyResult);

    expect(wrapper.classes()).toContain("xy-result");
    expect(wrapper.classes()).toContain("xy-result--md");
    expect(wrapper.classes()).toContain("is-neutral");
    expect(wrapper.find('[data-icon="mdi:information-outline"]').exists()).toBe(true);
  });

  it("支持 title、subTitle 和 description 文案", () => {
    const subTitleWrapper = mount(XyResult, {
      props: {
        title: "提交成功",
        subTitle: "任务已经进入处理队列"
      }
    });

    expect(subTitleWrapper.get(".xy-result__title").text()).toBe("提交成功");
    expect(subTitleWrapper.get(".xy-result__description").text()).toBe("任务已经进入处理队列");

    const descriptionWrapper = mount(XyResult, {
      props: {
        description: "新的主描述优先展示",
        subTitle: "旧字段会回退"
      }
    });

    expect(descriptionWrapper.get(".xy-result__description").text()).toBe("新的主描述优先展示");
  });

  it("description 插槽优先于 sub-title 插槽", () => {
    const wrapper = mount(XyResult, {
      slots: {
        description: "<span class='slot-description'>描述插槽</span>",
        "sub-title": "<span class='slot-sub-title'>旧描述插槽</span>"
      }
    });

    expect(wrapper.find(".slot-description").exists()).toBe(true);
    expect(wrapper.find(".slot-sub-title").exists()).toBe(false);
  });

  it("显式 icon 优先于 status 决定图标与语义色", () => {
    const wrapper = mount(XyResult, {
      props: {
        icon: "error",
        status: "success"
      }
    });

    expect(wrapper.classes()).toContain("is-danger");
    expect(wrapper.find('[data-icon="mdi:close-circle-outline"]').exists()).toBe(true);
  });

  it("支持后台状态码语义映射", () => {
    const wrapper = mount(XyResult, {
      props: {
        status: "403"
      }
    });

    expect(wrapper.classes()).toContain("is-warning");
    expect(wrapper.find('[data-icon="mdi:shield-lock-outline"]').exists()).toBe(true);
  });

  it("支持 size、variant 和 iconSize", () => {
    const wrapper = mount(XyResult, {
      props: {
        size: "lg",
        variant: "card",
        iconSize: 88
      }
    });

    expect(wrapper.classes()).toContain("xy-result--lg");
    expect(wrapper.classes()).toContain("xy-result--card");
    expect(wrapper.find(".xy-result__icon-symbol svg").attributes("style")).toContain("width: 88px");
  });

  it("默认插槽和 extra 插槽分别渲染内容区与操作区", () => {
    const wrapper = mount(XyResult, {
      slots: {
        default: "<p class='result-content'>补充说明</p>",
        extra: "<button class='result-action'>返回列表</button>"
      }
    });

    expect(wrapper.find(".xy-result__content .result-content").exists()).toBe(true);
    expect(wrapper.find(".xy-result__extra .result-action").exists()).toBe(true);
  });

  it("icon 插槽可以覆盖默认图标", () => {
    const wrapper = mount(XyResult, {
      slots: {
        icon: "<span class='custom-icon'>自定义图标</span>"
      }
    });

    expect(wrapper.find(".custom-icon").exists()).toBe(true);
    expect(wrapper.find(".xy-result__icon-symbol").exists()).toBe(false);
  });

  it("未传 size 时跟随 ConfigProvider 的全局尺寸", () => {
    const wrapper = mount(XyConfigProvider, {
      props: {
        size: "sm"
      },
      slots: {
        default: () => h(XyResult)
      }
    });

    expect(wrapper.find(".xy-result")?.classes()).toContain("xy-result--sm");
  });
});
