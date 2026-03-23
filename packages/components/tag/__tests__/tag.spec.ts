import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyTag } from "@xiaoye/components";

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

describe("XyTag", () => {
  it("支持状态、尺寸和圆角类名", () => {
    const wrapper = mount(XyTag, {
      props: {
        status: "primary",
        size: "lg",
        round: true
      },
      slots: {
        default: "进行中"
      }
    });

    expect(wrapper.classes()).toContain("xy-tag--primary");
    expect(wrapper.classes()).toContain("xy-tag--lg");
    expect(wrapper.classes()).toContain("is-round");
  });

  it("支持 icon prop，并为内容区域补图标结构", () => {
    const wrapper = mount(XyTag, {
      props: {
        icon: "mdi:tag-outline"
      },
      slots: {
        default: "带图标标签"
      }
    });

    expect(wrapper.classes()).toContain("is-with-icon");
    expect(wrapper.find(".xy-tag__content").exists()).toBe(true);
    expect(wrapper.find('[data-icon="mdi:tag-outline"]').exists()).toBe(true);
  });

  it("在未传 icon prop 时支持 icon 插槽", () => {
    const wrapper = mount(XyTag, {
      slots: {
        icon: "<span class='custom-icon'>*</span>",
        default: "插槽图标"
      }
    });

    expect(wrapper.find(".custom-icon").exists()).toBe(true);
  });

  it("icon prop 优先于 icon 插槽", () => {
    const wrapper = mount(XyTag, {
      props: {
        icon: "mdi:check"
      },
      slots: {
        icon: "<span class='custom-icon'>*</span>",
        default: "优先级"
      }
    });

    expect(wrapper.find('[data-icon="mdi:check"]').exists()).toBe(true);
    expect(wrapper.find(".custom-icon").exists()).toBe(false);
  });

  it("支持 closable 并使用关闭图标按钮", async () => {
    const wrapper = mount(XyTag, {
      props: {
        closable: true
      },
      slots: {
        default: "可关闭"
      }
    });

    expect(wrapper.classes()).toContain("is-closable");
    expect(wrapper.find('[data-icon="mdi:close"]').exists()).toBe(true);

    await wrapper.get(".xy-tag__close").trigger("click");

    expect(wrapper.emitted("close")).toHaveLength(1);
  });
});
