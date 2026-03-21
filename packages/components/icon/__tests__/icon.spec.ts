import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyIcon } from "@xiaoye/components";

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

describe("XyIcon", () => {
  it("透传 icon 并保留包装层样式", () => {
    const wrapper = mount(XyIcon, {
      props: {
        icon: "mdi:magnify"
      }
    });

    expect(wrapper.classes()).toContain("xy-icon");
    expect(wrapper.find('[data-icon="mdi:magnify"]').exists()).toBe(true);
  });

  it("支持 size、rotate 和 spin", () => {
    const wrapper = mount(XyIcon, {
      props: {
        icon: "mdi:loading",
        size: 20,
        rotate: 90,
        spin: true
      }
    });

    const svg = wrapper.find('[data-icon="mdi:loading"]');

    expect(wrapper.classes()).toContain("is-spin");
    expect(svg.attributes("style")).toContain("width: 20px");
    expect(svg.attributes("style")).toContain("height: 20px");
    expect(svg.attributes("style")).toContain("rotate(90deg)");
  });
});
