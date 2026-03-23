import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyLink } from "@xiaoye/components";

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

describe("XyLink", () => {
  it("默认渲染为文本链接", () => {
    const wrapper = mount(XyLink, {
      slots: {
        default: "查看详情"
      }
    });

    expect(wrapper.element.tagName).toBe("A");
    expect(wrapper.classes()).toContain("xy-link");
    expect(wrapper.classes()).toContain("xy-link--default");
    expect(wrapper.classes()).toContain("is-hover-underline");
    expect(wrapper.text()).toContain("查看详情");
  });

  it("未禁用时会派发 click，并透传 href 与 target", async () => {
    const wrapper = mount(XyLink, {
      props: {
        href: "https://example.com",
        target: "_blank"
      },
      slots: {
        default: "外部链接"
      }
    });

    await wrapper.trigger("click");

    expect(wrapper.emitted("click")).toHaveLength(1);
    expect(wrapper.attributes("href")).toBe("https://example.com");
    expect(wrapper.attributes("target")).toBe("_blank");
  });

  it("禁用时移除跳转属性并阻止 click", async () => {
    const wrapper = mount(XyLink, {
      props: {
        disabled: true,
        href: "https://example.com",
        target: "_blank"
      },
      slots: {
        default: "禁用链接"
      }
    });

    await wrapper.trigger("click");

    expect(wrapper.classes()).toContain("is-disabled");
    expect(wrapper.attributes("href")).toBeUndefined();
    expect(wrapper.attributes("target")).toBeUndefined();
    expect(wrapper.attributes("aria-disabled")).toBe("true");
    expect(wrapper.emitted("click")).toBeUndefined();
  });

  it("支持 underline 的 boolean 和字符串映射", () => {
    const hoverWrapper = mount(XyLink, {
      props: {
        underline: true
      }
    });
    const neverWrapper = mount(XyLink, {
      props: {
        underline: false
      }
    });
    const alwaysWrapper = mount(XyLink, {
      props: {
        underline: "always"
      }
    });

    expect(hoverWrapper.classes()).toContain("is-hover-underline");
    expect(neverWrapper.classes()).not.toContain("is-hover-underline");
    expect(neverWrapper.classes()).not.toContain("is-underline");
    expect(alwaysWrapper.classes()).toContain("is-underline");
  });

  it("支持图标 prop 与 icon 插槽", () => {
    const wrapper = mount(XyLink, {
      props: {
        icon: "mdi:open-in-new"
      },
      slots: {
        default: "查看文档",
        icon: "<span class='suffix-icon'>↗</span>"
      }
    });

    expect(wrapper.find('[data-icon="mdi:open-in-new"]').exists()).toBe(true);
    expect(wrapper.find(".suffix-icon").exists()).toBe(true);
  });

  it("在没有 href 时提供可聚焦的 link 语义", async () => {
    const wrapper = mount(XyLink, {
      slots: {
        default: "触发动作"
      }
    });

    await wrapper.trigger("keydown", {
      key: "Enter"
    });

    expect(wrapper.attributes("role")).toBe("link");
    expect(wrapper.attributes("tabindex")).toBe("0");
    expect(wrapper.emitted("click")).toHaveLength(1);
  });

  it("支持 info 类型和 icon-only 状态类", () => {
    const wrapper = mount(XyLink, {
      props: {
        type: "info",
        icon: "mdi:information-outline"
      },
      attrs: {
        "aria-label": "信息"
      }
    });

    expect(wrapper.classes()).toContain("xy-link--info");
    expect(wrapper.classes()).toContain("is-icon-only");
  });
});
