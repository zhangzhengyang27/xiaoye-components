import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XySkeletonItem } from "@xiaoye/components";

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

describe("XySkeletonItem", () => {
  it("默认渲染 text 变体", () => {
    const wrapper = mount(XySkeletonItem);

    expect(wrapper.find(".xy-skeleton__text").exists()).toBe(true);
  });

  it("支持 image 变体占位图标", () => {
    const wrapper = mount(XySkeletonItem, {
      props: {
        variant: "image"
      }
    });

    expect(wrapper.find('[data-icon="mdi:image-outline"]').exists()).toBe(true);
  });

  it("支持关键变体类名", () => {
    const wrapper = mount(XySkeletonItem, {
      props: {
        variant: "circle"
      }
    });

    expect(wrapper.find(".xy-skeleton__circle").exists()).toBe(true);
  });
});
