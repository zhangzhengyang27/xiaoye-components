import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyProForm } from "@xiaoye/pro-components";

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

describe("XyProForm", () => {
  it("支持渲染标题并展示 loading 状态", () => {
    const wrapper = mount(XyProForm, {
      props: {
        title: "成员信息",
        loading: true,
        model: {
          name: "小叶"
        }
      }
    });

    expect(wrapper.text()).toContain("成员信息");
    expect(wrapper.find(".xy-pro-form__loading").exists()).toBe(true);
  });
});
