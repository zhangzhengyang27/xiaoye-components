import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyColumnSettingPanel } from "@xiaoye/pro-components";

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

describe("XyColumnSettingPanel", () => {
  it("支持渲染标题并触发全选", async () => {
    const wrapper = mount(XyColumnSettingPanel, {
      props: {
        columns: [
          {
            key: "name",
            label: "名称"
          },
          {
            key: "status",
            label: "状态",
            disabled: true
          }
        ],
        modelValue: []
      }
    });

    expect(wrapper.text()).toContain("列设置");

    await wrapper.findAll(".xy-column-setting-panel__actions .xy-button")[0]?.trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toEqual(["name"]);
    expect(wrapper.emitted("change")?.[0]?.[0]).toEqual(["name"]);
  });
});
